import React, { useEffect, useState } from 'react';
import { Client, Databases } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import './competitors.css';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6864c522003108b9b279');

const databases = new Databases(client);

const DATABASE_ID = '6864c596000a79f621ee';
const COLLECTION_ID = '6864c74c000479f76901';

const Competitors = () => {
  const [confirmedCompetitors, setConfirmedCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchConfirmedCompetitors = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
      const confirmed = response.documents.filter(doc =>
        doc.status?.toLowerCase() === 'confirmed'
      );
      setConfirmedCompetitors(confirmed);
    } catch (error) {
      console.error('Error fetching confirmed competitors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmedCompetitors();

    const unsubscribe = client.subscribe(
      [`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`],
      (response) => {
        const updatedDoc = response.payload;
        const isConfirmed = updatedDoc.status?.toLowerCase() === 'confirmed';

        setConfirmedCompetitors((prev) => {
          const exists = prev.find(doc => doc.$id === updatedDoc.$id);

          if (isConfirmed) {
            if (exists) {
              // Update existing
              return prev.map(doc => (doc.$id === updatedDoc.$id ? updatedDoc : doc));
            } else {
              // Add new
              return [...prev, updatedDoc];
            }
          } else {
            // Remove if no longer confirmed
            return prev.filter(doc => doc.$id !== updatedDoc.$id);
          }
        });
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div>Loading confirmed competitors...</div>
      </div>
    );
  }

  return (
    <div className="competitors-container">
      <h2>✅ Confirmed Competitors</h2>

      <div className="table-responsive">
        <table className="competitors-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {confirmedCompetitors.length === 0 ? (
              <tr><td colSpan="2">No confirmed competitors found.</td></tr>
            ) : (
              confirmedCompetitors.map(({ $id, name, status }) => (
                <tr key={$id}>
                  <td>{name}</td>
                  <td className={`status ${status.toLowerCase()}`}>{status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="back-to-dashboard-container">
        <button
          className="back-to-dashboard-button"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Competitors;
