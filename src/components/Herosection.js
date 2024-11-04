import React, { useState, useEffect, useMemo } from 'react';
import './Herosection.css';
import logo from './images/healthlogo.png';
import SymptomCheckerModal from './SymptomCheckerModal'; // Import the Symptom Checker Modal

function HeroSection() {
  const [currentWord, setCurrentWord] = useState('Security');
  const [isModalOpen, setIsModalOpen] = useState(false); // For Symptom Checker Modal

  // Use useMemo to memoize the words array
  const words = useMemo(() => ['Security', 'Reliability', 'Efficiency', 'Convenience', 'Innovation'], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prevWord) => {
        const currentIndex = words.indexOf(prevWord);
        const nextIndex = (currentIndex + 1) % words.length;
        return words[nextIndex];
      });
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [words]); // words is now memoized, so it won't cause unnecessary renders

  // Function to open the Symptom Checker modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <h1 style={{ textAlign: 'left', fontSize: '3rem', fontWeight: '600' }}>
          Vital- Health Record System
        </h1>
        <p className="transition-text" style={{ fontWeight: 'bold', fontSize: '2.2rem', textAlign: 'left', color: '#333' }}>
          : We Provide <span className="dynamic-word">{currentWord}</span>
        </p>
        <p style={{ textAlign: 'left', fontSize: '1.2rem', lineHeight: '1.8', color: '#555' }}>
          Vital-EHR is a secure, intuitive platform designed to streamline hospital workflows and patient data management.
          Our system enhances communication between healthcare providers and patients while ensuring reliable, safe record-keeping.
          With built-in reporting tools for communicable diseases, we simplify healthcare operations.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button className="btn-get-started" style={{ padding: '12px 25px' }}>
            Get Started
          </button>
          <button
            className="btn-symptom-checker" // Add new button for Symptom Checker
            
            onClick={openModal}
          >
            Symptom Checker
          </button>
        </div>
      </div>
      <div className="hero-image">
        <img src={logo} alt="Health Illustration" style={{ width: '100%', maxWidth: '500px', height: 'auto' }} />
      </div>

      {/* Render Symptom Checker Modal */}
      {isModalOpen && <SymptomCheckerModal closeModal={closeModal} />}
    </section>
  );
}

export default HeroSection;
