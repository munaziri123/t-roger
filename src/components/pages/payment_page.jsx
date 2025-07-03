import React, { useState } from 'react';
import PaymentModal from '../model/payment_model';
import './payment_page.css';

const PaymentPage = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="payment-container">
      <div className="confirmation-box">
        <h2>Dosiye yawe isaba icyemezo cy’amavuko yakozwe neza</h2>
        <p><strong>Kode yo kwishyuriraho:</strong> 880703239619</p>
        <p><strong>Ikiguzi cya serivisi:</strong> RWF 500</p>
        <button onClick={handleOpenModal} className="pay-btn">Ishyura</button>
      </div>

      {showModal && <PaymentModal onClose={handleCloseModal} />}
    </div>
  );
};

export default PaymentPage;
