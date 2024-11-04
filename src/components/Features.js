// src/components/Features.js
import React from 'react';
import './Features.css';
import image1 from './images/patient.jpg';
import image2 from './images/datasec.jpg';
import image3 from './images/easyacces.jpg';
import image4 from './images/automated-report.png'; // New image for Automated Disease Report
import image5 from './images/ai-symptom.png'; // New image for AI-driven Symptom Checker
import image6 from './images/realtime-health.png'; // New image for Real-time Health Record Updates

function Features() {
  return (
    <section id="features" className="features-section">
      <h2>Our Features</h2>
      <div className="features-grid">
        {/* Existing Feature 1: Patient Management */}
        <div className="feature-item">
          <img src={image1} alt="Patient Management" />
          <h3>Patient Management</h3>
          <p>Track patient details, past medical history, and appointments all in one place.</p>
        </div>

        {/* Existing Feature 2: Data Security */}
        <div className="feature-item">
          <img src={image2} alt="Data Security" />
          <h3>Data Security</h3>
          <p>Our EHR ensures that all patient data is encrypted and secure.</p>
        </div>

        {/* Existing Feature 3: Easy Access */}
        <div className="feature-item">
          <img src={image3} alt="Easy Access" />
          <h3>Easy Access</h3>
          <p>Access medical records from anywhere using our user-friendly interface.</p>
        </div>

        {/* New Feature 4: Automated Disease Reports */}
        <div className="feature-item">
          <img src={image4} alt="Automated Disease Reports" />
          <h3>Automated Disease Reports</h3>
          <p>Generate real-time disease reports for communicable diseases like TB, MMR, and more with a single click.</p>
        </div>

        {/* New Feature 5: AI-driven Symptom Checker */}
        <div className="feature-item">
          <img src={image5} alt="AI-driven Symptom Checker" />
          <h3>AI-driven Symptom Checker</h3>
          <p>Our AI-powered symptom checker assists patients in understanding their symptoms and recommends next steps.</p>
        </div>

        {/* New Feature 6: Real-time Health Record Updates */}
        <div className="feature-item">
          <img src={image6} alt="Real-time Health Record Updates" />
          <h3>Real-time Health Record Updates</h3>
          <p>Doctors can update patient health records in real-time, ensuring accurate and up-to-date information.</p>
        </div>
      </div>
    </section>
  );
}

export default Features;
