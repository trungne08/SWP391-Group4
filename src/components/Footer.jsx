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
          <h4>Điều Khoản & Chính Sách</h4>
          <ul>
            <li><a href="#">Chính Sách Bảo Mật</a></li>
            <li><a href="#">Điều Khoản Dịch Vụ</a></li>
            <li><a href="#">Chính Sách Hoàn Tiền</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Thông Tin Liên Hệ</h4>
          <p>✉️ support@thaikycare.com</p>
          <p>📞 (+84) 987 654 321</p>
          <p>📍 Tầng 3, Tòa nhà ABC<br/>123 Đường XYZ, Quận 1<br/>Thành phố Hồ Chí Minh, Việt Nam</p>
        </div>

        <div className="footer-column">
          <h4>Liên Kết Nhanh</h4>
          <ul>
            <li><Link to="/about">Về Chúng Tôi</Link></li>
            <li><Link to="/membership">Gói Thành Viên</Link></li>
            <li><Link to="/blog">Blog Chia Sẻ</Link></li>
            <li><Link to="/faq">Hỏi Đáp</Link></li>
            <li><Link to="/contact">Liên Hệ</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
