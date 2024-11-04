import React from 'react';
import './Home.css';
import image from './images/v987-18a.jpg'

function Home() {
  return (
    <div>
      <header className="navbar">
        <div className="logo">
          <h1>Vital</h1>
          <img src={image} alt="EHR System" className="vital-logo" />
          <p>by-Vital Code</p>
        </div>
        <nav className="nav-links">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
          <div className="nav-right">
            <button className="btn-login">Login</button>
            <button className="btn-signup">Signup</button>
          </div>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-left">
          <h1>Vital</h1>
          <p>Your ultimate solution for efficient health management.</p>
          <div className="hero-buttons">
            <button className="btn-signup">Sign Up</button>
            <button className="btn-get-started">Get Started</button>
          </div>
        </div>
        <div className="hero-right">
          <img src="your-health-community-image.jpg" alt="Health and Community" />
        </div>
      </section>

      <section className="vital-services">
        <h2>What Vital Code Provides</h2>
        <div className="service-blocks">
          <div className="block">Efficient Medical Record Storage</div>
          <div className="block">Real-time Patient Updates</div>
          <div className="block">Secure Data Sharing</div>
          <div className="block">Doctor-Patient Communication</div>
          <div className="block">Integration with Health Devices</div>
          <div className="block">AI-driven Data Insights</div>
        </div>
      </section>

      <section className="reviews">
        <h2>What Our Customers Say</h2>
        <div className="review-slider">
          <div className="review">"Vital Code transformed how we manage patient data!" - Dr. Smith</div>
          <div className="review">"Excellent user interface and fast response times!" - Sarah J.</div>
          <div className="review">"A must-have tool for every hospital." - Dr. Alok</div>
          <div className="review">"Secure, reliable, and easy to use." - Maria K.</div>
        </div>
      </section>

      <footer className="footer">
        <div className="left">
          <h1>Vital</h1>
          <p>by Vital Code</p>
          <a href="#">Soon on App Store</a>
        </div>
        <div className="right">
          <div className="about-us">
            <h3>About Us</h3>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">News & Updates</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Testimonials</a></li>
              <li><a href="#">Logos & Branding</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div className="contact-us">
            <h3>Contact Us</h3>
            <div className="social-links">
              <a href="facebook.com"><img src="facebook-logo.png" alt="Facebook" /></a>
              <a href="linkedin.com"><img src="linkedin-logo.png" alt="LinkedIn" /></a>
              <a href="instagram.com"><img src="instagram-logo.png" alt="Instagram" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
