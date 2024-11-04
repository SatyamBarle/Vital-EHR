// src/components/Footer.js
import React from 'react';
import './Footer.css'; // Import the CSS file for styling
import facebookIcon from './images/facebookIcon.png'; // Example image import
import twitterIcon from './images/twitter icon.png';
import linkedinIcon from './images/linkedinIcon.png';
import instagramIcon from './images/instagramIcon.jpg';
import youtubeIcon from './images/youtubeIcon.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h1 className="footer-logo">Vital</h1>
        <p className="footer-desc">by VitalCode</p>
        <p className="footer-contact">Contact Us: +910823456</p>
        <div className="social-links">
          <a href="#"><img src={facebookIcon} alt="Facebook" /></a>
          <a href="#"><img src={twitterIcon} alt="Twitter" /></a>
          <a href="#"><img src={linkedinIcon} alt="LinkedIn" /></a>
          <a href="#"><img src={instagramIcon} alt="Instagram" /></a>
          <a href="#"><img src={youtubeIcon} alt="YouTube" /></a>
        </div>
      </div>
      <div className="footer-links">
        <div className="footer-column">
          <h3>Solutions</h3>
          <ul>
            <li><a href="#">EHR</a></li>
            <li><a href="#">Telehealth</a></li>
            <li><a href="#"> Management</a></li>
            <li><a href="#">Medical Billing</a></li>
            <li><a href="#">Patient Portal</a></li>
            <li><a href="#">Mobile EHR</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Resources</h3>
          <ul>
            <li><a href="#">Support Center</a></li>
            <li><a href="#">API & SDK</a></li>
            <li><a href="#">EHR FAQ</a></li>
            <li><a href="#">Medical Form Library</a></li>
            <li><a href="#">App Directory</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>About</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">News & Updates</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Testimonials</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Legal</h3>
          <ul>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">API Policy</a></li>
            <li><a href="#">Security Policy</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
