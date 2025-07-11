// src/components/admin/Scanner.jsx
import React, { useEffect, useState } from 'react';
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
  const [scannerStarted, setScannerStarted] = useState(false);
  const [scannerInstance, setScannerInstance] = useState(null);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 3000);
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
        showFeedback('error', '⚠️ Already Used');
      } else {
        await databases.updateDocument(DATABASE_ID, TICKET_COLLECTION_ID, ticket.$id, {
          status: 'scanned',
        });
        showFeedback('success', `✅ Welcome ${ticket.name}`);
      }

      stopScanner(); // auto-stop after scan
    } catch (err) {
      console.error(err);
      showFeedback('error', '❌ Scan Error');
    }
  };

  const startScanner = () => {
    if (scannerStarted) return;

    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: 250,
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanner.SCAN_TYPE_CAMERA],
    });

    scanner.render(
      (decodedText) => handleScanSuccess(decodedText),
      (error) => console.warn('Scan error', error)
    );

    setScannerInstance(scanner);
    setScannerStarted(true);
  };

  const stopScanner = () => {
    if (scannerInstance) {
      scannerInstance.clear().then(() => {
        setScannerStarted(false);
        setScannerInstance(null);
      });
    }
  };

  return (
    <div className="scanner-wrapper">
      <h1 className="scanner-title">🎫 Ticket Scanner</h1>

      {!scannerStarted && (
        <button className="primary-btn" onClick={startScanner}>Start Scanning</button>
      )}

      {scannerStarted && (
        <div className="scanner-actions">
          <div id="qr-reader" style={{ width: '100%' }}></div>
          <button className="stop-btn" onClick={stopScanner}>Stop Scanning</button>
        </div>
      )}

      {feedback && (
        <div className={`feedback-box ${feedback.type}`}>
          <div className="icon">{feedback.type === 'success' ? '✔' : '✖'}</div>
          <p>{feedback.message}</p>
        </div>
      )}
    </div>
  );
};

export default Scanner;
