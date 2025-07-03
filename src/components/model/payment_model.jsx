import React from 'react';
import '../model/payment_model.css';

const PaymentModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>X</button>
        
        <h3>Ni gute wifuza kwishyura?</h3>

        <div className="payment-options">
          <ul>
            <li className="active">MTN Mobile Money</li>
            <li>Airtel Money</li>
            <li>Ikarta ya Banki</li>
            <li>Amafaranga mu ntoki / Ejenti</li>
            <li>Konti za banki</li>
          </ul>
        </div>

        <div className="mtn-instructions">
          <p>Kanda ino mibare kuri telefone yawe ya MTN maze wishyure:</p>
          <div className="ussd-code">
            <span>*182*3*7*880703239619#</span>
          </div>
          <p>Cyangwa ushyiremo numero yawe ya MTN MoMo maze wishyure</p>
          <input type="text" placeholder="ex: 078/9xxxxxxx" />
          <button className="pay-now">Ishyura 500 RWF</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
