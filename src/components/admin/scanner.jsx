import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Client, Databases, Query } from 'appwrite';
import './scanner.css';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6864c522003108b9b279');

const databases = new Databases(client);
const DATABASE_ID = '6864c596000a79f621ee';
const TICKET_COLLECTION_ID = '686fbd05002b5b00e16a';

const Scanner = () => {
  const [scanning, setScanning] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
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

      stopScanner();
    } catch (err) {
      console.error(err);
      showFeedback('error', '❌ Scan Error');
    }
  };

  const startScanner = async () => {
    if (scanning || !scannerRef.current) return;

    const html5QrCode = new Html5Qrcode(scannerRef.current.id);
    html5QrCodeRef.current = html5QrCode;

    try {
      const cameras = await Html5Qrcode.getCameras();
      if (cameras && cameras.length > 0) {
        setScanning(true);

        html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
          },
          handleScanSuccess,
          (err) => {
            console.warn('Scan Error', err);
          }
        );
      } else {
        alert('No camera found');
      }
    } catch (err) {
      console.error('Camera error', err);
    }
  };

  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
        setScanning(false);
      });
    }
  };

  return (
    <div className="scanner-wrapper">
      <h1 className="scanner-title">🎫 Ticket Scanner</h1>

      {!scanning && (
        <button className="primary-btn" onClick={startScanner}>Start Scanning</button>
      )}

      <div
        id="qr-reader"
        ref={scannerRef}
        style={{ width: '100%', maxWidth: 400, marginTop: '20px' }}
      />

      {scanning && (
        <button className="stop-btn" onClick={stopScanner}>
          Stop Scanning
        </button>
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
