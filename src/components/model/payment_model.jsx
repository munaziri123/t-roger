import React from 'react';
import { AlertTriangle } from 'lucide-react';
import '../model/payment_model.css';

const PaymentModal = ({ onClose }) => {
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
          While this feature is still under development, you can proceed by paying through the <strong>MTN MoMo code</strong> below.
          <p className='code-box'>MTN MoMo Code: 12345678</p>
        </p>

        <p className="modal-description">
          Once your payment is received, your <strong>Performer Badge</strong> and <strong>Entry Letter</strong> will be sent to you via email. Thank you for your understanding and patience.
        </p>
        <button className="pay-now" disabled>Ishyura 10,000 RWF</button>
      </div>
    </div>
  );
};

export default PaymentModal;
