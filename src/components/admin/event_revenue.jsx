import React, { useEffect, useState } from 'react';
import { Client, Databases, Query, Realtime } from 'appwrite';
import CountUp from 'react-countup';
import './TotalRevenue.css';

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

    const realtime = new Realtime(client);
    const unsubscribe = realtime.subscribe(
      `databases.${DATABASE_ID}.collections.${TICKET_COLLECTION_ID}.documents`,
      (response) => {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          fetchRevenue(); // update on new ticket
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="revenue-card-wrapper">
      <div className="revenue-card">
        <div className="revenue-top">
          <h4>Total Revenue</h4>
          <span className="revenue-chip" />
        </div>
        <div className="revenue-middle">
          <h2>
            <CountUp
              end={total}
              duration={1.5}
              prefix="RWF "
              separator=","
              decimals={0}
            />
          </h2>
        </div>
        <div className="revenue-bottom">
          <p>Updated in real-time</p>
        </div>
      </div>
    </div>
  );
};

export default TotalRevenue;
