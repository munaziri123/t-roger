import React, { useState, useEffect } from 'react';
import './navbar.css';
import { FaSearch, FaUserCircle, FaBell, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../assets/react.jpg';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-brand">
            <a href="/">
              <img src={logo} alt="ENTFlix Logo" className="logo-image" width="140" height="80" />
            </a>
          </div>

          {/* Desktop Search */}
          <div className="navbar-search">
            <input
              type="text"
              placeholder="Search movies, shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>

          {/* Desktop Links */}
          <div className="navbar-links">
            <ul>
              <li><a href="/" className="nav-link active">Home</a></li>
              <li><a href="/movies" className="nav-link">Events</a></li>
              <li><a href="/tv" className="nav-link">TV Shows</a></li>
              <li><a href="/events" className="nav-link">About us</a></li>
            </ul>
          </div>

          {/* Desktop User Actions */}
          <div className="navbar-actions">
            <button className="notification-btn">
              <FaBell />
              <span className="notification-badge">3</span>
            </button>
            <button className="user-btn">
              <FaUserCircle />
            </button>
          </div>

          {/* Mobile Actions */}
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

      {/* Mobile Search Overlay */}
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

      {/* Mobile Navigation Modal */}
      {isModalOpen && (
        <div className="mobile-nav-overlay">
          <button className="close-button" onClick={closeModal}>
            <FaTimes size={24} />
          </button>
          <ul className="mobile-nav-links">
            <li><a href="/" onClick={closeModal}>Home</a></li>
            <li><a href="/movies" onClick={closeModal}>Events</a></li>
            <li><a href="/tv" onClick={closeModal}>TV Shows</a></li>
            <li><a href="/events" onClick={closeModal}>About us</a></li>
          </ul>
        </div>
      )}

      {/* Prevent overlap */}
      <div style={{ marginTop: '80px' }} />
    </>
  );
};

export default Navbar;
