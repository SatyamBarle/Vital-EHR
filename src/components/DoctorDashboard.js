// src/components/DoctorDashboard.js
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './DoctorDashboard.css';
import DoctorProfile from './DoctorProfile'; // Ensure this is a default export
import PatientList from './PatientList'; // Ensure this is a default export
import AppointmentManager from './AppointmentManager'; // Ensure this is a default export
import PatientHealthRecord from './PatientHealthRecord'; // Ensure this is a default export
import HealthRecordUpdate from './HealthRecordUpdate'; // Ensure this is a default export
import DiseaseReports from './DiseaseReports'; // New Disease Report component

function DoctorDashboard() {
  // Get current location to handle active link styles
  const location = useLocation();

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        {/* Doctor Profile Link */}
        <div className="doctor-info">
        <h3>Doctor Profile</h3>
          <Link to="profile" className={`sidebar-item ${location.pathname === "/doctor/profile" ? "active" : ""}`}>
            <i className="fas fa-user-md"></i> Doctor Profile
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="navigation">
        <h3>Navigation</h3>
          <Link to="patient-list" className={`sidebar-item ${location.pathname === "/doctor/patient-list" ? "active" : ""}`}>
            <i className="fas fa-users"></i> Patient List
          </Link>
          <Link to="appointment-manager" className={`sidebar-item ${location.pathname === "/doctor/appointment-manager" ? "active" : ""}`}>
            <i className="fas fa-calendar-check"></i> Appointment Manager
          </Link>
          <Link to="patient-health-record" className={`sidebar-item ${location.pathname === "/doctor/patient-health-record" ? "active" : ""}`}>
            <i className="fas fa-file-medical"></i> Patient Health Record
          </Link>
          <Link to="health-record-update" className={`sidebar-item ${location.pathname === "/doctor/health-record-update" ? "active" : ""}`}>
            <i className="fas fa-edit"></i> Health Record Update
          </Link>
          {/* New Disease Report Link */}
          <Link to="disease-reports" className={`sidebar-item ${location.pathname === "/doctor/disease-reports" ? "active" : ""}`}>
            <i className="fas fa-chart-line"></i> Disease Report
          </Link>
          <Link to="/login" className="sidebar-item logout">
            <i className="fas fa-sign-out-alt"></i> Logout
          </Link>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <Routes>
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="patient-list" element={<PatientList />} />
          <Route path="appointment-manager" element={<AppointmentManager />} />
          <Route path="patient-health-record" element={<PatientHealthRecord />} />
          <Route path="health-record-update" element={<HealthRecordUpdate />} />
          {/* New Route for Disease Reports */}
          <Route path="disease-reports" element={<DiseaseReports />} />
        </Routes>
      </div>
    </div>
  );
}

export default DoctorDashboard;
