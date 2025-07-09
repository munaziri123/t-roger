import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import { FaSearch, FaUserCircle, FaBell, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../assets/react.jpg';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const navigate = useNavigate();

 useEffect(() => {
  const adminStatus = localStorage.getItem('isAdmin') === 'true';
  setIsAdminLoggedIn(adminStatus);

  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };
  window.addEventListener('scroll', handleScroll);

  const handleStorageChange = () => {
    setIsAdminLoggedIn(localStorage.getItem('isAdmin') === 'true');
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('admin-login', handleAdminLogin);

  return () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('admin-login', handleAdminLogin);
  };
}, []);


  const toggleModal = () => {
    setIsModalOpen(prev => !prev);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdminLoggedIn(false);
    navigate('/admin-login');
    closeModal();
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-brand">
            <Link to="/">
              <img src={logo} alt="ENTFlix Logo" className="logo-image" width="140" height="80" />
            </Link>
          </div>

          <div className="navbar-search">
            <input
              type="text"
              placeholder="Search events, shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>

          <div className="navbar-links">
            <ul>
              <li><Link to="/" className="nav-link active">Home</Link></li>
              <li><Link to="/categories" className="nav-link">Events</Link></li>
              <li><Link to="/" className="nav-link">TV Shows</Link></li>
              <li><Link to="/" className="nav-link">About us</Link></li>
              <li>
               {isAdminLoggedIn ? (
  <button
  onClick={handleLogout}
  style={{
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-muted)',   // same as nav links normal color
    fontSize: '1rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontFamily: "'Bebas Neue', sans-serif",
    padding: '0.5rem 0',
    textDecoration: 'none',
    position: 'relative',
    transition: 'color 0.3s ease',
    display: 'inline',
  }}
  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-light)'}
  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
>
  Logout
</button>

) : (
  <Link to="/admin-login" className="nav-link">
    Login as admin
  </Link>
)}

              </li>
            </ul>
          </div>

          <div className="navbar-actions">
            <button className="notification-btn">
              <FaBell />
              <span className="notification-badge">3</span>
            </button>
            <button className="user-btn">
              <FaUserCircle />
            </button>
          </div>

          <div className="navbar-mobile-actions">
            <button className="mobile-search-btn" onClick={toggleMobileSearch} aria-label="Search">
              <FaSearch size={18} />
            </button>
            <div
              className="navbar-mobile-menu"
              onClick={toggleModal}
              aria-expanded={isModalOpen}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleModal()}
            >
              <FaBars size={22} />
            </div>
          </div>
        </div>
      </nav>

      {showMobileSearch && (
        <div className="mobile-search-overlay">
          <input
            type="text"
            placeholder="Search an event or show..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mobile-search-input"
          />
          <button className="mobile-search-close" onClick={toggleMobileSearch}>
            <FaTimes />
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="mobile-nav-overlay">
          <button className="close-button" onClick={closeModal}>
            <FaTimes size={24} />
          </button>
          <ul className="mobile-nav-links">
            <li><Link to="/" onClick={closeModal}>Home</Link></li>
            <li><Link to="/movies" onClick={closeModal}>Events</Link></li>
            <li><Link to="/tv" onClick={closeModal}>TV Shows</Link></li>
            <li><Link to="/events" onClick={closeModal}>About us</Link></li>
            <li>
             {isAdminLoggedIn ? (
  <button
  onClick={handleLogout}
  style={{
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#000',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    padding: 0,
    fontFamily: 'inherit',
  }}
  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-secondary)'}
  onMouseLeave={e => e.currentTarget.style.color = '#000'}
>
  Logout
</button>

) : (
  <Link to="/admin-login" className="nav-link">
    Login as admin
  </Link>
)}

            </li>
          </ul>
        </div>
      )}

      <div style={{ marginTop: '80px' }} />
    </>
  );
};

export default Navbar;
