import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonBreastfeeding } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faYoutube, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#f8f9fa', padding: '40px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', padding: '0 20px' }}>
        {/* Logo Section */}
        <div>
          <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
            <FontAwesomeIcon icon={faPersonBreastfeeding} size="2x" />
          </Link>
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </div>
        </div>

        {/* Policies & Terms */}
        <div>
          <h3>Policies & Terms</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/refund">Refund Policy</Link></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3>Contact Information</h3>
          <p>Address:</p>
          <p>3rd Floor, ABC Building, 123 XYZ Street, District 1, Ho Chi Minh City, Vietnam</p>
          <p>Phone: (+84) 987 654 321</p>
          <p>Email: support@babycare.com</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/membership">Membership Plans</Link></li>
            <li><Link to="/blog">Experience Blog</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;