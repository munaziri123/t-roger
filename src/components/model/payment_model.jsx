import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../model/payment_model.css';

const PaymentModal = ({ onClose }) => {
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    setProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      const data = JSON.parse(localStorage.getItem('registrationData'));
      if (!data) {
        alert('No registration data found.');
        setProcessing(false);
        return;
      }

      const { name, category, refId } = data;

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text('🎫 T-ROGER FAMILY ENTRANCE LETTER 🎫', 20, 25);

      // Add logo (optional: hosted on GitHub or public folder)
      const logoUrl = 'https://raw.githubusercontent.com/munaziri123/t-roger/main/public/react.jpg';
      doc.addImage(logoUrl, 'JPEG', 150, 10, 40, 20);

      doc.setFontSize(12);
      doc.text(`Dear ${name},`, 20, 50);
      doc.text(`You have successfully registered as a performer in the category of "${category}".`, 20, 60);
      doc.text(`Your registration number is:`, 20, 70);
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 255);
      doc.text(refId || 'MUNA-XXXXXX', 20, 78);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`📍 Competition Location: Kigali Convention Center`, 20, 95);
      doc.text(`📅 Competition Date: 1st September 2025`, 20, 105);
      doc.text(`💰 Amount Paid: 10,000 RWF`, 20, 115);

      doc.text(`\nThank you for joining the T-Roger family. We look forward to your performance!`, 20, 130);

      doc.setFontSize(12);
      doc.text(`\nSigned by:`, 20, 150);
      doc.setFont('helvetica', 'bold');
      doc.text(`IRADUKUNDA Thierry Roger`, 20, 160);
      doc.setFont('helvetica', 'normal');
      doc.text(`CEO, T-Roger Talent Family`, 20, 168);

      doc.save(`T-Roger_Entrance_Letter_${refId || 'MUNA'}.pdf`);
      setProcessing(false);
    }, 3000); // 3s simulation
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>X</button>

        <div className="modal-header">
          <AlertTriangle size={32} color="#FFCC00" style={{ marginRight: '10px' }} />
          <h3>Important Payment Information</h3>
        </div>

        <p className="modal-description">
          We are currently working hard to enable <strong>direct online payment</strong> on our platform. 🙏
          Until then, please pay using the <strong>MTN MoMo code</strong> below.
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
      </div>
    </div>
  );
};

export default PaymentModal;
