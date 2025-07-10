import React, { useState } from 'react';
import { Client, Databases, Query } from 'appwrite';
import jsPDF from 'jspdf';
import './ticketing.css';

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
  const [ticketData, setTicketData] = useState(null);  // Store ticket info for preview
  const [pdfDoc, setPdfDoc] = useState(null);          // Store jsPDF instance for print/download

  // Convert image URL to base64
  const getBase64FromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Generate jsPDF object (but don't save/download yet)
  const generatePdfDoc = async (userData) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [210, 99],
    });

    const logoUrl = 'https://raw.githubusercontent.com/munaziri123/t-roger/main/public/react.jpg';
    const logoBase64 = await getBase64FromUrl(logoUrl);

    const currentDate = new Date().toLocaleDateString();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);

    if (logoBase64) {
      doc.addImage(logoBase64, 'JPEG', 10, 10, 30, 30);
    }

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

    return doc;
  };

  // Handle generating the ticket and preview
  const handleGenerateTicket = async () => {
    if (!refId || !fee) {
      alert('Please enter both registration number and fee.');
      return;
    }

    setLoading(true);

    try {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('refId', refId)
      ]);

      if (res.documents.length === 0) {
        alert('No user found with this registration number.');
        setLoading(false);
        return;
      }

      const user = res.documents[0];
      const doc = await generatePdfDoc(user);

      setTicketData(user);
      setPdfDoc(doc);
    } catch (err) {
      console.error('Error generating ticket:', err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // Download the PDF
  const handleDownload = () => {
    if (!pdfDoc) return;
    pdfDoc.save(`T-Roger_Ticket_${refId}.pdf`);
  };

  // Print the PDF (opens the print dialog)
  const handlePrint = () => {
    if (!pdfDoc) return;
    pdfDoc.autoPrint();
    window.open(pdfDoc.output('bloburl'), '_blank');
  };

  return (
    <div className="ticketing-container">
      <h2>🎫 Generate Event Ticket</h2>

      <div className="form-group">
        <label>Registration Number</label>
        <input
          type="text"
          value={refId}
          onChange={(e) => setRefId(e.target.value)}
          placeholder="Enter reg number..."
        />
      </div>

      <div className="form-group">
        <label>Ticket Fee (RWF)</label>
        <input
          type="number"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          placeholder="5000"
        />
      </div>

      <button onClick={handleGenerateTicket} disabled={loading}>
        {loading ? 'Generating Ticket...' : '🎉 Welcome'}
      </button>

      {/* Show ticket preview & print/download only if ticketData exists */}
      {ticketData && (
        <div className="ticket-preview">
          <h3>Ticket Preview</h3>
          <p><b>Name:</b> {ticketData.name}</p>
          <p><b>Registration No:</b> {ticketData.refId}</p>
          <p><b>Fee:</b> {fee} RWF</p>
          {/* Add more details if needed */}

          <button onClick={handleDownload}>Download PDF</button>
          <button onClick={handlePrint}>Print Ticket</button>
        </div>
      )}
    </div>
  );
};

export default Ticketing;
