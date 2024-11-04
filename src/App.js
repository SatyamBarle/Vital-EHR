import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/Herosection';
import Features from './components/Features';
import WhyChooseUs from './components/Whychooseus';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import SignUp from './components/SignUp';
import Login from './components/Login';
import './App.css';

function App() {
  const [userType, setUserType] = useState(''); // State to store user type

  // Function to handle redirection after login based on userType
  const handleRedirection = () => {
    if (userType === 'Patient') {
      return <Navigate to="/patient-dashboard" />;
    } else if (userType === 'Doctor') {
      return <Navigate to="/doctor-dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <HeroSection />
              <Features />
              <WhyChooseUs />
              <Testimonials />
              <Footer />
            </>
          } />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login setUserType={setUserType} />} /> {/* Pass setUserType to Login */}
          <Route path="/patient-dashboard/*" element={<PatientDashboard />} />
          <Route path="/doctor-dashboard/*" element={<DoctorDashboard />} />

          {/* Redirection based on userType */}
          <Route path="/dashboard" element={handleRedirection()} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
