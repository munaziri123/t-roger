import React, { useState } from 'react';
import { databases } from 'appwrite';
import { AlertTriangle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import jsPDF from 'jspdf';
import '../model/payment_model.css';

const PaymentModal = ({ onClose }) => {
  const [processing, setProcessing] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [pdfData, setPdfData] = useState(null);

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

  const generatePdf = async () => {
    const data = JSON.parse(localStorage.getItem('munaUser'));
    if (!data) {
      alert('No registration data found.');
      return null;
    }

    const { name, category, refId } = data;

    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4',
    });

    const logoUrl = 'https://raw.githubusercontent.com/munaziri123/t-roger/main/public/react.jpg';
    const signUrl = 'https://raw.githubusercontent.com/munaziri123/t-roger/main/public/signature.png';

    let logoBase64 = '';
    let signBase64 = '';
    try {
      logoBase64 = await getBase64FromUrl(logoUrl);
      signBase64 = await getBase64FromUrl(signUrl);
    } catch (error) {
      console.warn('Failed to load logo or signature image', error);
    }

    if (logoBase64) {
      doc.addImage(logoBase64, 'JPEG', 150, 10, 40, 20);
    }

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('T-ROGER FAMILY COMPETITION ENTRANCE LETTER', 20, 30);

    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Dear ${name},`, 20, 50);
    doc.text(
      `You have successfully registered as a Competitor in the category of "${category}".`,
      20,
      60
    );
    doc.text(`Your registration number is: ${refId}`, 20, 70);

    doc.text('Competition Details:', 20, 85);

    doc.setFont('helvetica', 'bold');
    doc.text('Location:', 30, 95);
    doc.setFont('helvetica', 'normal');
    doc.text('Kigali Convention Center', 60, 95);

    doc.setFont('helvetica', 'bold');
    doc.text('Date:', 30, 105);
    doc.setFont('helvetica', 'normal');
    doc.text('1st September 2025', 60, 105);

    doc.setFont('helvetica', 'bold');
    doc.text('Amount Paid:', 30, 115);
    doc.setFont('helvetica', 'normal');
    doc.text('10,000 RWF', 60, 115);

    doc.setFont('helvetica', 'normal');
    doc.text(
      'Thank you for joining the T-Roger family. We look forward to your performance!',
      20,
      135,
      { maxWidth: 170 }
    );

    doc.setFont('helvetica', 'bold');
    doc.text('Signed by:', 20, 160);
    doc.text('IRADUKUNDA Thierry Roger', 20, 170);
    doc.setFont('helvetica', 'normal');
    if (signBase64) {
      doc.addImage(signBase64, 'PNG', 20, 182, 50, 20);
    }
    doc.text('CEO, T-Roger Talent Family', 20, 178);

    return doc;
  };

const handlePayment = async () => {
  setProcessing(true);

  setTimeout(async () => {
    const doc = await generatePdf();

    if (!doc) {
      setProcessing(false);
      return;
    }

    try {
      const documentId = localStorage.getItem('documentId');
      const databaseId = '6864c596000a79f621ee';
      const collectionId = '6864c74c000479f76901';

      if (documentId) {
        await databases.updateDocument(databaseId, collectionId, documentId, {
          status: 'confirmed',
        });

        // ✅ Clean up after update
        localStorage.removeItem('documentId');
      }
    } catch (error) {
      console.error('❌ Failed to update payment status:', error);
    }

    setPdfData(doc);
    setProcessing(false);
    setShowCongrats(true);
  }, 3000);
};

  const handleDownload = () => {
    if (pdfData) {
      const data = JSON.parse(localStorage.getItem('munaUser'));
      const refId = data?.refId || 'MUNA';
      pdfData.save(`T-Roger_Entrance_Letter_${refId}.pdf`);
      setShowCongrats(false);
      onClose();
      window.location.href = '/';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>
          X
        </button>

        {!showCongrats ? (
          <>
            <div className="modal-header">
              <AlertTriangle size={32} color="#FFCC00" style={{ marginRight: '10px' }} />
              <h3>Important Payment Information</h3>
            </div>

            <p className="modal-description">
              We are currently working hard to enable <strong>direct online payment</strong> on our
              platform. 🙏 Until then, please pay using the <strong>MTN MoMo code</strong> below.
            </p>

            <p className="code-box">MTN MoMo Code: 12345678</p>

            <p className="modal-description">
              After your payment, click <strong>"Ishyura"</strong> to generate your entrance letter.
            </p>

            <button className="pay-now" onClick={handlePayment} disabled={processing}>
              {processing ? 'Processing Payment...' : 'Ishyura 10,000 RWF'}
            </button>

            <p className="modal-description" style={{ marginTop: '20px' }}>
              For questions, contact <strong>T-Roger</strong> via WhatsApp:
            </p>

            <a
              className="whatsapp-icon-btn"
              href="https://wa.me/213665239048?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20the%20payment%20process."
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp size={32} />
            </a>
          </>
        ) : (
          <div className="congrats-popup">
            <h2>🎉 Payment Successful! 🎉</h2>
            <p>Your payment was processed successfully.</p>
            <button className="ok-btn" onClick={handleDownload}>
              OK - Download Entrance Letter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
