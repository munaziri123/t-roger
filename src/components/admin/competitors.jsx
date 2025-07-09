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
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCompetitors = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
      setCompetitors(response.documents);
    } catch (error) {
      console.error('Error fetching competitors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitors();

    const unsubscribe = client.subscribe(
      [`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`],
      (response) => {
        const updatedDoc = response.payload;

        setCompetitors((prev) => {
          const index = prev.findIndex(doc => doc.$id === updatedDoc.$id);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = updatedDoc;
            return updated;
          } else {
            return [...prev, updatedDoc];
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
        <div>Loading competitors...</div>
      </div>
    );
  }

  return (
    <div className="competitors-container">
      <h2>Competitors</h2>

      {/* Responsive wrapper for the table */}
      <div className="table-responsive">
        <table className="competitors-table">
          <thead>
            <tr>
              <th>Competitor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {competitors.length === 0 ? (
              <tr><td colSpan="2">No competitors found.</td></tr>
            ) : (
              competitors.map(({ $id, name, status }) => (
                <tr key={$id}>
                  <td>{name}</td>
                  <td className={`status ${status ? status.toLowerCase() : 'pending'}`}>
                    {status || 'Pending'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Centered Back to Dashboard button */}
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
