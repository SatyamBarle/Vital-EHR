// src/components/Navbar.js
import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import image from './images/Vitallogo.png';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={image} alt="Vital Logo" className="logo" />
        <span></span>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li> {/* Use Link for internal routing */}
        <li><a href="#features">Features</a></li> {/* Assuming these are section links */}
        <li><a href="#why-choose-us">Why Choose Us</a></li>
        <li><a href="#testimonials">Testimonials</a></li>
        <li><a href="#contact">Contact Us</a></li>
      </ul>
      <div className="navbar-buttons">
        <Link to="/login">
          <button className="btn-login">Log In</button> {/* Use Link to navigate to Login */}
        </Link>
        <Link to="/signup">
          <button className="btn-signup">Sign Up</button> {/* Use Link to navigate to Sign Up */}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
