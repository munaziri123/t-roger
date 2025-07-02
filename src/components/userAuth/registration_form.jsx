import React, { useState } from 'react';
import './registration_form.css';
import '../pages/register_loader.css';
import logo from '../../assets/react.jpg'; 
import { databases } from '../../appwrite/appwrite_configuration';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: '',
    district: '',
    sector: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await databases.createDocument(
        '6864c596000a79f621ee',    
        '6864c74c000479f76901',   
        'unique()',            
        formData
      );

      // Show loading screen for 5 seconds
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);

        // Reset form
        setFormData({
          name: '',
          phone: '',
          category: '',
          district: '',
          sector: '',
        });

        // Redirect after 3 seconds
        setTimeout(() => {
          window.location.href = '/payment';
        }, 3000);
      }, 5000);
    } catch (err) {
      console.error('Error saving to Appwrite:', err);
      alert('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="loader-overlay">
        <div className="loader-content">
          <img src={logo} alt="T-Roger Logo" className="static-logo" />
          <p className="register-message">You are registering to T-Roger family...</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="register-success-container">
        <h2>🎉 Congratulations! Registration Successful 🎉</h2>
        <p>Redirecting to payment page...</p>
      </div>
    );
  }

  return (
    <div className="register-form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="logo-wrapper">
          <img src={logo} alt="T-Roger Logo" className="form-logo" />
        </div>

        <h2 className="form-title">Join T-Roger Talent Family</h2>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="e.g. 0788xxxxxx"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Performing Category</label>
          <input
            type="text"
            name="category"
            placeholder="e.g. Singer, Dancer, DJ..."
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>District</label>
          <input
            type="text"
            name="district"
            placeholder="e.g. Kigali"
            value={formData.district}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Sector</label>
          <input
            type="text"
            name="sector"
            placeholder="e.g. Gasabo"
            value={formData.sector}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="fire-submit-button">
          🔥 Register Now
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
