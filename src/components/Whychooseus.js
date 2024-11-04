// src/components/WhyChooseUs.js
import React from 'react';
import './Whychooseus.css';

function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="why-choose-us-section">
      <h2>Why Choose Us?</h2>
      <div className="choose-grid">
        <div className="choose-item">
          <h3>Reliability</h3>
          <p>We offer 99.9% uptime so your hospital operations never stop.</p>
        </div>
        <div className="choose-item">
          <h3>Innovation</h3>
          <p>Leverage AI and ML to get valuable insights from your hospital's data.</p>
        </div>
        <div className="choose-item">
          <h3>Support</h3>
          <p>Our team is available 24/7 to assist you in case of any issues.</p>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
