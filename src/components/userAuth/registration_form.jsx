import React, { useState } from 'react';
import './registration_form.css';
import logo from '../../assets/react.jpg'; // Replace with your actual logo path

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: '',
    district: '',
    sector: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    alert('🎉 Registration submitted successfully!');
    // Add form submission logic here (API call, validation, etc.)
  };

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
