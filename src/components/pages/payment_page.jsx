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
        <h2>Registration Payment Required</h2>
        
        <p>
          You have been successfully registered to perform at the upcoming event, proudly sponsored by the <strong>T-Roger Family</strong>.
        </p>
        <p>
          To receive your <strong>Performer Badge</strong> and <strong>Welcome Letter</strong>, you are required to complete your registration payment.
        </p>
        <p>
          Please click <strong>"Ishyura"</strong> below to proceed with payment.
        </p>

        <p><strong>Kode yo kwishyuriraho:</strong> 880703239619</p>
        <p><strong>Ikiguzi cya serivisi:</strong> RWF 500</p>
        
        <button onClick={handleOpenModal} className="pay-btn">Ishyura</button>
      </div>

      {showModal && <PaymentModal onClose={handleCloseModal} />}
    </div>
  );
};

export default PaymentPage;
