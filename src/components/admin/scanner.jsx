// Scanner.js
import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Client, Databases, Query } from 'appwrite';
import './scanner.css';

// Appwrite config
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6864c522003108b9b279');

const databases = new Databases(client);
const DATABASE_ID = '6864c596000a79f621ee';
const TICKET_COLLECTION_ID = '686fbd05002b5b00e16a';

const Scanner = () => {
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000); // Hide after 3 seconds
  };

  const handleScanSuccess = async (ticketId) => {
    try {
      const res = await databases.listDocuments(DATABASE_ID, TICKET_COLLECTION_ID, [
        Query.equal('ticketId', ticketId),
      ]);

      if (res.documents.length === 0) {
        showFeedback('error', '❌ Ticket Not Found');
        return;
      }

      const ticket = res.documents[0];

      if (ticket.status === 'scanned') {
        showFeedback('error', '❌ Ticket Already Used');
      } else {
        await databases.updateDocument(DATABASE_ID, TICKET_COLLECTION_ID, ticket.$id, {
          status: 'scanned',
        });
        showFeedback('success', `✅ Welcome ${ticket.name}!`);
      }
    } catch (err) {
      console.error(err);
      showFeedback('error', '❌ Scan Error');
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        handleScanSuccess(decodedText);
        scanner.clear();
      },
      (err) => {
        console.warn(err);
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  return (
    <div className="scanner-container">
      <h2>🎟️ Scan Ticket</h2>
      <div id="qr-reader" style={{ width: '100%' }}></div>

      {feedback && (
        <div className={`feedback ${feedback.type}`}>
          <div className="symbol">
            {feedback.type === 'success' ? '✔' : '✖'}
          </div>
          <p>{feedback.message}</p>
        </div>
      )}
    </div>
  );
};

export default Scanner;
