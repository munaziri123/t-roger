import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import logo from '../../assets/react.jpg';
import '../model/payment_model.css';

const PaymentModal = ({ onClose }) => {
  const [step, setStep] = useState('form'); // 'form' | 'processing' | 'letter'
  const [momoNumber, setMomoNumber] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('t-roger-user');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  const handlePayment = () => {
    if (!momoNumber) return alert('Please enter your MTN number');
    setStep('processing');

    setTimeout(() => {
      setStep('letter');
    }, 3000);
  };

  if (step === 'processing') {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <p className="modal-description">Processing payment, please wait...</p>
          <div className="spinner" style={{ marginTop: '20px' }}></div>
        </div>
      </div>
    );
  }

  if (step === 'letter') {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <button className="close-btn" onClick={onClose}>X</button>
          <div className="letter-header">
            <h2>🎉 Congratulations!</h2>
            <img src={logo} alt="Logo" className="letter-logo" />
          </div>

          <p>Dear <strong>{userData?.name || 'Performer'}</strong>,</p>
          <p>We are thrilled to confirm your registration in the T-Roger Family Talent Competition.</p>

          <p><strong>Category:</strong> {userData?.category || 'N/A'}</p>
          <p><strong>Amount Paid:</strong> RWF 10,000</p>

          <p>
            🗓️ The competition will take place on <strong>August 15, 2025</strong> at <strong>Petit Stade, Kigali</strong>. Please come on time and bring your ID or phone confirmation.
          </p>

          <p>
            🎫 Your competition badge will be issued at the entrance on the event day.
          </p>

          <p>
            📧 For any additional help, feel free to contact us via WhatsApp or Email at <strong>trogerfamily@gmail.com</strong> or call <strong>+250 788 000 000</strong>.
          </p>

          <p className="signature">
            Signed,<br />
            <strong>IRADUKUNDA Thiery Roger</strong><br />
            CEO, T-Roger Family
          </p>

          <button className="pay-now" onClick={() => alert('Letter download coming soon...')}>
            Download Entry Letter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>X</button>

        <div className="modal-header">
          <AlertTriangle size={32} color="#FFCC00" style={{ marginRight: '10px' }} />
          <h3>Important Payment Information</h3>
        </div>

        {userData && (
          <div className="user-summary-box">
            <p><strong>👤 Name:</strong> {userData.name}</p>
            <p><strong>📞 Phone:</strong> {userData.phone}</p>
            <p><strong>📧 Email:</strong> {userData.email}</p>
            <p><strong>🎭 Category:</strong> {userData.category}</p>
            <p><strong>📍 District:</strong> {userData.district}</p>
            <p><strong>🗺️ Sector:</strong> {userData.sector}</p>
            <hr />
          </div>
        )}

        <p className="modal-description">
          We are working hard to enable <strong>online payments</strong>. For now, please use the MTN MoMo code below:
          <div className="code-box">12345678</div>
        </p>

        <div className="mtn-instructions">
          <label htmlFor="momoNumber" style={{ marginBottom: '8px', display: 'block' }}>
            Enter your MTN number:
          </label>
          <input
            type="text"
            id="momoNumber"
            placeholder="e.g. 078xxxxxxx"
            value={momoNumber}
            onChange={(e) => setMomoNumber(e.target.value)}
          />
        </div>

        <button className="pay-now" onClick={handlePayment}>
          Ishyura 10,000 RWF
        </button>

        <p className="modal-description" style={{ marginTop: '20px' }}>
          For questions, contact us on WhatsApp:
        </p>

        <a
          className="whatsapp-icon-btn"
          href="https://wa.me/213665239048"
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
