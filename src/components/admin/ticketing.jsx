import React, { useState, useEffect } from 'react';
import { Client, Databases, Query } from 'appwrite';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import './ticketing.css';

// Appwrite setup
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6864c522003108b9b279');

const databases = new Databases(client);
const DATABASE_ID = '6864c596000a79f621ee';
const REG_COLLECTION_ID = '6864c74c000479f76901';
const TICKET_COLLECTION_ID = '686fbd05002b5b00e16a';

const Ticketing = () => {
  const [isRegistered, setIsRegistered] = useState(true);
  const [refId, setRefId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [fee, setFee] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [qrImage, setQrImage] = useState('');

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

  const generatePdfDoc = async (ticket) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [210, 99],
    });

    const logoUrl = 'https://raw.githubusercontent.com/munaziri123/t-roger/main/public/react.jpg';
    const logoBase64 = await getBase64FromUrl(logoUrl);

    // Generate QR code base64 from ticketId on the fly
    const qrCodeBase64 = await QRCode.toDataURL(ticket.ticketId);

    const currentDate = new Date().toLocaleDateString();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);

    if (logoBase64) {
      doc.addImage(logoBase64, 'JPEG', 10, 10, 30, 30);
    }

    if (qrCodeBase64) {
      doc.addImage(qrCodeBase64, 'JPEG', 160, 10, 30, 30);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('T-ROGER EVENT TICKET', 50, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${currentDate}`, 50, 30);
    doc.text(`Name: ${ticket.name}`, 50, 38);
    doc.text(`Reg No: ${ticket.refId || 'N/A'}`, 50, 46);
    doc.text(`Email: ${ticket.email || 'N/A'}`, 50, 54);
    doc.text(`Fee: ${ticket.fee} RWF`, 50, 62);
    doc.text(`Ticket ID: ${ticket.ticketId}`, 50, 70);

    doc.setFont('helvetica', 'italic');
    doc.text('Welcome to the T-Roger party! 🎉', 50, 82);
    doc.setFont('helvetica', 'bold');
    doc.text(`Valid Until: ${expiryDate.toLocaleDateString()}`, 50, 94);

    return doc;
  };

  useEffect(() => {
    if (ticketId) {
      QRCode.toDataURL(ticketId).then(setQrImage);
    }
  }, [ticketId]);

  const handleGenerateTicket = async () => {
    if (isRegistered && (!refId || !fee)) {
      alert('Please enter both registration number and fee.');
      return;
    }

    if (!isRegistered && (!name || !email || !fee)) {
      alert('Please enter your name, email, and fee.');
      return;
    }

    setLoading(true);

    try {
      let ticketInfo;

      if (isRegistered) {
        const res = await databases.listDocuments(DATABASE_ID, REG_COLLECTION_ID, [
          Query.equal('refId', refId),
        ]);

        if (res.documents.length === 0) {
          alert('No registered user found with this registration number.');
          setLoading(false);
          return;
        }

        const user = res.documents[0];
        ticketInfo = {
          name: user.name,
          refId: user.refId,
          email: user.email || '',
          fee,
          paidAt: new Date().toISOString(),
        };
      } else {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        const namePrefix = name.trim().substring(0, 4).toUpperCase();
        const Id = `TRF${randomNumber}${namePrefix}VISITOR`;

        ticketInfo = {
          name,
          refId: Id,
          email,
          fee,
          paidAt: new Date().toISOString(),
        };
      }

      const generatedId = uuidv4();
      setTicketId(generatedId);

      ticketInfo.ticketId = generatedId;
      ticketInfo.status = 'unscanned';
      // DO NOT save qrCode base64 string in Appwrite, just the ticketId
      // ticketInfo.qrCode = qrCodeBase64; // removed!

      const createRes = await databases.createDocument(
        DATABASE_ID,
        TICKET_COLLECTION_ID,
        'unique()',
        ticketInfo
      );

      ticketInfo.id = createRes.$id;

      const doc = await generatePdfDoc(ticketInfo);
      setTicketData(ticketInfo);
      setPdfDoc(doc);
      setModalOpen(true);
    } catch (err) {
      console.error('Error generating ticket:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfDoc) return;
    pdfDoc.save(`T-Roger_Ticket_${ticketData.id || ticketData.refId}.pdf`);
    window.location.href = '/dashboard/ticketing';
  };

  const handleCancel = () => {
  // Clear all form fields
  setName('');
  setEmail('');
  setFee('');
  setRefId('');
  setTicketData(null);
  setPdfDoc(null);
  setTicketId('');
  setQrImage('');
  setModalOpen(false);
};

  const handlePrint = () => {
    if (!pdfDoc) return;
    pdfDoc.autoPrint();
    window.open(pdfDoc.output('bloburl'), '_blank');
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  };

  return (
    <div className="ticketing-container">
      <h2>🎫 Generate Event Ticket</h2>

      <div className="radio-options">
        <label>
          <input
            type="radio"
            checked={isRegistered}
            onChange={() => setIsRegistered(true)}
          />
          Registered User
        </label>
        <label>
          <input
            type="radio"
            checked={!isRegistered}
            onChange={() => setIsRegistered(false)}
          />
          Unregistered User
        </label>
      </div>

      {isRegistered ? (
        <>
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
        </>
      ) : (
        <>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
        </>
      )}

      <button onClick={handleGenerateTicket} disabled={loading}>
        {loading ? 'Generating Ticket...' : '🎉 Welcome'}
      </button>

      {modalOpen && ticketData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>T-Roger Event Ticket</h3>
            <p><strong>Name:</strong> {ticketData.name}</p>
            <p><strong>Registration Number:</strong> {ticketData.refId || 'N/A'}</p>
            <p><strong>Email:</strong> {ticketData.email || 'N/A'}</p>
            <p><strong>Fee:</strong> {ticketData.fee} RWF</p>
            <p><strong>Ticket ID:</strong> {ticketData.ticketId}</p>

            {qrImage && (
              <div style={{ marginTop: '10px' }}>
                <img src={qrImage} alt="QR Code" width={120} height={120} />
                <p style={{ fontSize: '10px', wordBreak: 'break-word' }}>{ticketData.ticketId}</p>
              </div>
            )}

            <p><em>Welcome to the T-Roger party!</em></p>
            <p><small>Valid Until: {(new Date(Date.now() + 24 * 60 * 60 * 1000)).toLocaleDateString()}</small></p>

            <div className="modal-buttons">
              <button onClick={handlePrint}>Print Ticket</button>
              <button onClick={handleDownload}>Download PDF</button>
              <button onClick={handleCancel}>close</button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ticketing;
