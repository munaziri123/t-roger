import React, { useState } from 'react';
import { Client, Databases, Query } from 'appwrite';
import jsPDF from 'jspdf';
import './ticketing.css';

// Appwrite setup
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6864c522003108b9b279');

const databases = new Databases(client);
const DATABASE_ID = '6864c596000a79f621ee';
const COLLECTION_ID = '6864c74c000479f76901';

const Ticketing = () => {
  const [refId, setRefId] = useState('');
  const [fee, setFee] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getBase64FromUrl = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const generateTicketPDF = async (userData) => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [210, 99], // Compact ticket size
      });

      const logoUrl = 'https://raw.githubusercontent.com/munaziri123/t-roger/main/public/react.jpg';
      const logoBase64 = await getBase64FromUrl(logoUrl);

      const currentDate = new Date().toLocaleDateString();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1);

      // Logo
      if (logoBase64) {
        doc.addImage(logoBase64, 'JPEG', 10, 10, 30, 30);
      }

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('T-ROGER EVENT TICKET', 50, 20);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');

      doc.text(`Date: ${currentDate}`, 50, 30);
      doc.text(`Name: ${userData.name}`, 50, 38);
      doc.text(`Reg No: ${userData.refId}`, 50, 46);
      doc.text(`Fee: ${fee} RWF`, 50, 54);

      doc.setFont('helvetica', 'italic');
      doc.text('Welcome to the T-Roger party! 🎉', 50, 66);
      doc.text('Wishing you success and enjoyment.', 50, 74);

      doc.setFont('helvetica', 'bold');
      doc.text(`Valid Until: ${expiryDate.toLocaleDateString()}`, 50, 85);

      doc.save(`T-Roger_Ticket_${userData.refId}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      setError('Failed to generate ticket PDF.');
    }
  };

  const handleGenerateTicket = async () => {
    setError('');
    if (!refId.trim() || !fee.trim()) {
      setError('Please enter both registration number and fee.');
      return;
    }

    setLoading(true);

    try {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('refId', refId.trim())
      ]);

      if (res.documents.length === 0) {
        setError('No user found with this registration number.');
        setLoading(false);
        return;
      }

      const user = res.documents[0];
      await generateTicketPDF(user);
    } catch (err) {
      console.error('Error generating ticket:', err);
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticketing-container">
      <h2>🎫 Generate Event Ticket</h2>

      <div className="form-group">
        <label htmlFor="refId">Registration Number</label>
        <input
          id="refId"
          type="text"
          value={refId}
          onChange={(e) => setRefId(e.target.value)}
          placeholder="Enter reg number..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="fee">Ticket Fee (RWF)</label>
        <input
          id="fee"
          type="number"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          placeholder="5000"
          min="0"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button onClick={handleGenerateTicket} disabled={loading}>
        {loading ? 'Generating Ticket...' : '🎉 Welcome'}
      </button>
    </div>
  );
};

export default Ticketing;
