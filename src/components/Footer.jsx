import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faYoutube,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faPersonBreastfeeding } from "@fortawesome/free-solid-svg-icons";
import "./Footer.css";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-column social-column">
          <FontAwesomeIcon 
            icon={faPersonBreastfeeding} 
            className="footer-logo"
            style={{ color: '#FF69B4' }}
          />
          <div className="footer-social">
            <FontAwesomeIcon icon={faFacebook} />
            <FontAwesomeIcon icon={faYoutube} />
            <FontAwesomeIcon icon={faXTwitter} />
          </div>
        </div>

        <div className="footer-column">
          <h4>Policies & Terms</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Refund Policy</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Contact Information</h4>
          <p>✉️ support@thaikycare.com</p>
          <p>📞 (+84) 987 654 321</p>
          <p>📍 3rd Floor, ABC Building<br/>123 XYZ Street, District 1<br/>Ho Chi Minh City, Vietnam</p>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
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
