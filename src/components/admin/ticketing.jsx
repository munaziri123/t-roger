import React, { useState } from 'react';
import { Client, Databases, Query } from 'appwrite';
import jsPDF from 'jspdf';
import './ticketing.css';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6864c522003108b9b279');

const databases = new Databases(client);

const DATABASE_ID = '6864c596000a79f621ee'; // Your DB id
const REG_COLLECTION_ID = '6864c74c000479f76901'; // Registration collection
const TICKET_COLLECTION_ID = '686fbd05002b5b00e16a'; // NEW tickets collection ID

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
    doc.text(`Name: ${ticket.name}`, 50, 38);
    doc.text(`Reg No: ${ticket.refId || 'N/A'}`, 50, 46);
    doc.text(`Email: ${ticket.email || 'N/A'}`, 50, 54);
    doc.text(`Fee: ${ticket.fee} RWF`, 50, 62);

    doc.setFont('helvetica', 'italic');
    doc.text('Welcome to the T-Roger party! 🎉', 50, 74);
    doc.text('Wishing you success and enjoyment.', 50, 82);

    doc.setFont('helvetica', 'bold');
    doc.text(`Valid Until: ${expiryDate.toLocaleDateString()}`, 50, 94);

    return doc;
  };
const randomNumber = Math.floor(100000 + Math.random() * 900000);
const Id = `TRF${randomNumber}${namePrefix}VISITOR`;

  const handleGenerateTicket = async () => {
    if (isRegistered) {
      if (!refId || !fee) {
        alert('Please enter both registration number and fee.');
        return;
      }
    } else {
      if (!name || !email || !fee) {
        alert('Please enter your name, email, and fee.');
        return;
      }
    }

    setLoading(true);

    try {
      let ticketInfo;

      if (isRegistered) {
        // Verify reg number exists
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
        // Unregistered user creates ticket directly
        ticketInfo = {
          name,
          refId: Id,
          email,
          fee,
          paidAt: new Date().toISOString(),
        };
      }

      // Save ticket to new tickets collection
      const createRes = await databases.createDocument(
        DATABASE_ID,
        TICKET_COLLECTION_ID,
        'unique()', // let Appwrite generate unique ID
        ticketInfo
      );

      // Attach ticket id to ticketInfo for display
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
    // After download, redirect to dashboard
    window.location.href = '/dashboard';
  };

  const handlePrint = () => {
    if (!pdfDoc) return;
    pdfDoc.autoPrint();
    window.open(pdfDoc.output('bloburl'), '_blank');
    // After print, redirect to dashboard
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  };

  return (
    <div className="ticketing-container">
      <h2>🎫 Generate Event Ticket</h2>

      <div className="form-group">
        <label>
          <input
            type="radio"
            checked={isRegistered}
            onChange={() => setIsRegistered(true)}
          />
          Registered User
        </label>
        <label style={{ marginLeft: '20px' }}>
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

      {/* Modal for ticket display */}
      {modalOpen && ticketData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>T-Roger Event Ticket</h3>
            <p><strong>Name:</strong> {ticketData.name}</p>
            <p><strong>Registration Number:</strong> {ticketData.refId || 'N/A'}</p>
            <p><strong>Email:</strong> {ticketData.email || 'N/A'}</p>
            <p><strong>Fee:</strong> {ticketData.fee} RWF</p>
            <p><em>Welcome to the T-Roger party! 🎉</em></p>
            <p><small>Valid Until: {(new Date(Date.now() + 24 * 60 * 60 * 1000)).toLocaleDateString()}</small></p>

            <div className="modal-buttons">
              <button onClick={handlePrint}>Print Ticket</button>
              <button onClick={handleDownload}>Download PDF</button>
              <button onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ticketing;
