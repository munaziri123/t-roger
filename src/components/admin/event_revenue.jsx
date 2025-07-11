import React, { useEffect, useState } from 'react';
import { Client, Databases, Query, Realtime } from 'appwrite';
import CountUp from 'react-countup';
import './event_revenue.css';

// Appwrite setup
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6864c522003108b9b279');

const databases = new Databases(client);
const DATABASE_ID = '6864c596000a79f621ee';
const TICKET_COLLECTION_ID = '686fbd05002b5b00e16a';

const TotalRevenue = () => {
  const [total, setTotal] = useState(0);

  const fetchRevenue = async () => {
    try {
      const res = await databases.listDocuments(DATABASE_ID, TICKET_COLLECTION_ID);
      const sum = res.documents.reduce((acc, doc) => acc + parseFloat(doc.fee || 0), 0);
      setTotal(sum);
    } catch (error) {
      console.error('Failed to fetch total revenue:', error);
    }
  };

  useEffect(() => {
    fetchRevenue();

  
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${TICKET_COLLECTION_ID}.documents`,
      (response) => {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          fetchRevenue();
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="revenue-full-bg">
      <div className="revenue-full-card">
        <div className="revenue-top">
          <h3>Total Revenue</h3>
          <div className="revenue-chip" />
        </div>
        <div className="revenue-middle">
          <h1>
            <CountUp
              end={total}
              duration={1.5}
              prefix="RWF "
              separator=","
              decimals={0}
            />
          </h1>
        </div>
        <div className="revenue-bottom">
          <p>Updated in real-time</p>
        </div>
      </div>
    </div>
  );
};

export default TotalRevenue;
