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
        </p>

        <p className="modal-description">
          Once your payment is received, your <strong>Performer Badge</strong> and <strong>Entry Letter</strong> will be sent to you via email. Thank you for your understanding and patience.
        </p>

        <p className="code-label">MoMo Code yo kwishyuriraho:</p>
        <div className="code-box">123456</div>

        <p className="modal-description">Cyangwa andika numero yawe ya MTN hano:</p>
        <input type="text" placeholder="ex: 078xxxxxxx" className="mtn-input" />
        <button className="pay-now">Ishyura 10,000 RWF</button>
      </div>
    </div>
  );
};

export default PaymentModal;
