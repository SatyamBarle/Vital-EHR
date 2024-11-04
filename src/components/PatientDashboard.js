// src/components/PatientDashboard.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './PatientDashboard.css';
import UserProfile from './UserProfile';
import PatientHistory from './PatientHistory';
import UpcomingAppointments from './UpcomingAppointments';
import HealthRecords from './HealthRecords';
import FeedbackReviews from './FeedBackReviews';
import ScheduleAppointments from './ScheduleAppointments';
import AvailableDoctors from './AvailableDoctors';

function PatientDashboard() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        {/* User Info Block */}
        <div className="user-info">
          <h3>User Info</h3>
          <Link to="profile" className="sidebar-item">
            <i className="fas fa-user-circle"></i> User Profile
          </Link>
        </div>

        {/* Healthcare Block */}
        <div className="healthcare-block">
          <h3>Healthcare</h3>
          <Link to="patient-history" className="sidebar-item">
            <i className="fas fa-notes-medical"></i> Patient History
          </Link>
          <Link to="upcoming-appointments" className="sidebar-item">
            <i className="fas fa-calendar-alt"></i> Upcoming Appointments
          </Link>
          <Link to="health-records" className="sidebar-item">
            <i className="fas fa-file-medical-alt"></i> Health Records
          </Link>
          <Link to="feedback-reviews" className="sidebar-item">
            <i className="fas fa-comments"></i> Feedback Reviews
          </Link>
          <Link to="schedule-appointments" className="sidebar-item">
            <i className="fas fa-calendar-plus"></i> Schedule Appointments
          </Link>
          <Link to="available-doctors" className="sidebar-item">
            <i className="fas fa-user-md"></i> Available Doctors
          </Link>
          <Link to="/login" className="sidebar-item logout">
            <i className="fas fa-sign-out-alt"></i> Logout
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <Routes>
          <Route path="profile" element={<UserProfile />} />
          <Route path="patient-history" element={<PatientHistory />} />
          <Route path="upcoming-appointments" element={<UpcomingAppointments />} />
          <Route path="health-records" element={<HealthRecords />} />
          <Route path="feedback-reviews" element={<FeedbackReviews />} />
          <Route path="schedule-appointments" element={<ScheduleAppointments />} />
          <Route path="available-doctors" element={<AvailableDoctors />} />
        </Routes>
      </div>
    </div>
  );
}

export default PatientDashboard;
