import React, { useEffect, useState } from 'react';
import { Client, Databases } from 'appwrite';
import './event_revenue.css'; // Custom styling

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6864c522003108b9b279');

const databases = new Databases(client);
const DATABASE_ID = '6864c596000a79f621ee';
const TICKET_COLLECTION_ID = '686fbd05002b5b00e16a';

const TotalRevenue = () => {
  const [displayRevenue, setDisplayRevenue] = useState(0);

  const animateCountUp = (from, to) => {
    const duration = 1000;
    const stepTime = 20;
    const steps = Math.ceil(duration / stepTime);
    const stepAmount = (to - from) / steps;
    let current = from;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current += stepAmount;
      setDisplayRevenue(Math.floor(current));

      if (step >= steps) {
        setDisplayRevenue(Math.floor(to));
        clearInterval(interval);
      }
    }, stepTime);
  };

  const calculateRevenue = async () => {
    try {
      const res = await databases.listDocuments(DATABASE_ID, TICKET_COLLECTION_ID, []);
      const sum = res.documents.reduce((acc, doc) => acc + parseFloat(doc.fee || 0), 0);
      animateCountUp(displayRevenue, sum);
    } catch (err) {
      console.error('Error calculating revenue:', err);
    }
  };

  useEffect(() => {
    calculateRevenue();

    const unsubscribe = client.subscribe(
      [`databases.${DATABASE_ID}.collections.${TICKET_COLLECTION_ID}.documents`],
      response => {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          const newFee = parseFloat(response.payload.fee || 0);
          const newTotal = parseFloat(displayRevenue) + newFee;
          animateCountUp(displayRevenue, newTotal);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="revenue-container">
      <div className="card">
        <h2>Total Revenue</h2>
        <p className="amount">{displayRevenue.toLocaleString()} RWF</p>
        <span className="badge">Realtime Updated 💸</span>
      </div>
    </div>
  );
};

export default TotalRevenue;
