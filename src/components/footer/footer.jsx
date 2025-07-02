import React from 'react';
import './footer.css';
import { FaFacebookF, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-top">
          <div className="footer-brand">
            <h2>T-Roger Family</h2>
            <p>Empowering the next generation of performers through events, exposure, and mentorship.</p>
            <div className="footer-socials">
              <a href="https://web.facebook.com/profile.php?id=100006158568955" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
              <a href="https://www.instagram.com/t_roger_250/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://www.linkedin.com/in/iradukunda-thierry-roger-a2509b1b4/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
              <a href="https://www.youtube.com/results?search_query=t-roger+family" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            </div>
          </div>

          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>Email: info.trogerfamily@gmail.com</p>
            <p>Phone: +250 781065953</p>
            <p>Kigali, Rwanda</p>

            <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
              <h4>Send Us a Message</h4>
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
              />
              <textarea
                name="message"
                rows="3"
                placeholder="Your question"
                required
              ></textarea>
              <button type="submit">Submit</button>
            </form>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/register">Register</a></li>
              <li><a href="/categories">Events</a></li>
              <li><a href="/">About</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} T-Roger Family. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
