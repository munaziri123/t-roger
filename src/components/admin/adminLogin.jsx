import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client, Databases, Query } from 'appwrite';
import './admin_login.css';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6864c522003108b9b279');

const databases = new Databases(client);

const DATABASE_ID = '6864c596000a79f621ee';  
const COLLECTION_ID = '686eb7950024cfe3a679'; 

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Query admins collection for documents where 'email' equals the entered email
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('email', email)  // <-- Correct Query usage here
      ]);

      if (response.documents.length === 0) {
        setError('Email not found');
      } else {
        const adminDoc = response.documents[0];

        // Compare password stored in admin document
        if (adminDoc.password === password) {
          localStorage.setItem('isAdmin', 'true');
          window.dispatchEvent(new Event('admin-login'));
          navigate('/dashboard');
        } else {
          setError('Incorrect password');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleLogin}>
        <h2>Admin Panel</h2>
        <p className="subtitle">Login to access your dashboard</p>
        {error && <div className="login-error">{error}</div>}
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
