import React from 'react';
import './footer.css';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-top">
          <div className="footer-brand">
            <h2>T-Roger Family</h2>
            <p>Empowering the next generation of performers through events, exposure, and mentorship.</p>
            <div className="footer-socials">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaYoutube /></a>
            </div>
          </div>

          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>Email: info.trogerfamily@gmail.com</p>
            <p>Phone: +250 781065953</p>
            <p>Kigali, Rwanda</p>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/register">Register</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} T-Roger Family. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
