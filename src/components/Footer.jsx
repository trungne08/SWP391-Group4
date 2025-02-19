import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faYoutube,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faPersonBreastfeeding } from "@fortawesome/free-solid-svg-icons";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Cột 1 - Logo + Social Media */}
        <div className="footer-column social-column">
          <FontAwesomeIcon icon={faPersonBreastfeeding} className="footer-logo" />
          <div className="footer-social">
            <FontAwesomeIcon icon={faFacebook} />
            <FontAwesomeIcon icon={faYoutube} />
            <FontAwesomeIcon icon={faXTwitter} />
          </div>
        </div>

        {/* Cột 2 - Chính sách & Điều khoản */}
        <div className="footer-column">
          <h4>Policies & Terms</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Refund Policy</a></li>
          </ul>
        </div>

        {/* Cột 3 - Thông tin liên hệ */}
        <div className="footer-column">
          <h4>Contact Information</h4>
          <p>Address:<br/> 3rd Floor, ABC Building, 123 XYZ Street, District 1, Ho Chi Minh City, Vietnam</p>
          <p>Phone: (+84) 987 654 321</p>
          <p>Email: support@thaikycare.com</p>
        </div>

        {/* Cột 4 - Liên kết nhanh */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Membership Plans</a></li>
            <li><a href="#">Experience Blog</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
