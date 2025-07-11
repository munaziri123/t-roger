import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Client, Databases, Query } from 'appwrite';
import './scanner.css';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6864c522003108b9b279');

const databases = new Databases(client);
const DATABASE_ID = '6864c596000a79f621ee';
const TICKET_COLLECTION_ID = '686fbd05002b5b00e16a';

const Scanner = () => {
  const [feedback, setFeedback] = useState(null);
  const scannerRef = useRef(null); // store scanner instance

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
      startScanner(); // restart scanner after feedback disappears
    }, 2500);
  };

  const handleScanSuccess = async (ticketId) => {
    if (scannerRef.current) {
      scannerRef.current.clear(); // stop scanner temporarily
    }

    try {
      const res = await databases.listDocuments(DATABASE_ID, TICKET_COLLECTION_ID, [
        Query.equal('ticketId', ticketId),
      ]);

      if (res.documents.length === 0) {
        showFeedback('error', 'Ticket Not Found');
        return;
      }

      const ticket = res.documents[0];

      if (ticket.status === 'scanned') {
        showFeedback('error', 'Ticket Already Used');
      } else {
        await databases.updateDocument(DATABASE_ID, TICKET_COLLECTION_ID, ticket.$id, {
          status: 'scanned',
        });
        showFeedback('success', `Welcome ${ticket.name}!`);
      }
    } catch (err) {
      console.error(err);
      showFeedback('error', 'Scan Error');
    }
  };

  const startScanner = () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner('qr-reader', {
        fps: 10,
        qrbox: 250,
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
      });
    }

    scannerRef.current.render(
      (decodedText) => {
        handleScanSuccess(decodedText);
      },
      (error) => {
        console.warn(error);
      }
    );
  };

  useEffect(() => {
    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="scanner-container">
      <h2>🎟️ Scan Ticket</h2>
      <div id="qr-reader" style={{ width: '100%' }}></div>

      {feedback && (
        <div className={`feedback ${feedback.type}`}>
          {feedback.type === 'success' ? '✔' : '✖'}
          <p>{feedback.message}</p>
        </div>
      )}
    </div>
  );
};

export default Scanner;
