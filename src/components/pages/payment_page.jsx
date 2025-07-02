import React from 'react';
import { AlertTriangle } from 'lucide-react'; // Use lucide-react icons
import './payment_page.css';

const PaymentPage = () => {
  return (
    <div className="payment-container">
      <div className="alert-box">
        <AlertTriangle size={60} color="#e63946" />
        <h1>⚠️ Payment Page Coming Soon!</h1>
        <p>We’re working hard to bring this feature to you. Please stay tuned!</p>
      </div>
    </div>
  );
};

export default PaymentPage;
