import React, { useState, useEffect } from 'react';
import { getPatientsForDoctor, getHealthRecords } from '../services/firebaseService'; // Import necessary functions from Firebase services
import { auth } from '../firebase'; // Firebase authentication
import './PatientHealthRecord.css'; // Custom styles for the component

function PatientHealthRecord() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // New state for modal

  // Fetch patients for the logged-in doctor
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setLoading(false);
        setFormError('No user is logged in.');
        return;
      }

      try {
        const fetchedPatients = await getPatientsForDoctor(currentUser.uid);
        if (fetchedPatients && fetchedPatients.length > 0) {
          setPatients(fetchedPatients);
        } else {
          setFormError('No patients have booked appointments with you.');
        }
      } catch (error) {
        setFormError('Error fetching patients.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Fetch health records for a selected patient and open modal
  const handlePatientSelect = async (patientId) => {
    if (!patientId) {
      console.error("Patient ID is missing.");
      return;
    }

    try {
      const fetchedRecords = await getHealthRecords(patientId);
      setSelectedPatient(patientId);
      setHealthRecords(fetchedRecords);
      setIsModalOpen(true); // Open modal on successful data fetch
    } catch (error) {
      console.error('Error fetching health records:', error);
      setFormError('Error fetching health records.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (formError) {
    return <p className="error-message">{formError}</p>;
  }

  return (
    <div className="patient-health-record-container">
      <h2>Patient Health Records</h2>

      {/* Patient Selection */}
      <div className="patient-list">
        <h3>Select a Patient</h3>
        {patients.length === 0 ? (
          <p>No patients have booked appointments with you.</p>
        ) : (
          <ul>
            {patients.map((patient) => (
              <li 
                key={patient.patientId}
                className="patient-item" 
                onClick={() => handlePatientSelect(patient.patientId)}
              >
                {patient.firstName} {patient.lastName} - Age: {patient.age}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal for Health Records */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-btn" onClick={closeModal}>×</span>
            <h3>Health Records for Selected Patient</h3>
            {healthRecords.length === 0 ? (
              <p>No health records found for this patient.</p>
            ) : (
              <div className="records-grid">
                {healthRecords.map((record) => (
                  <div key={record.id || record.date + record.title} className="record-card">
                    <h4>{record.title}</h4>
                    <p>{record.description}</p>
                    <p><strong>Date:</strong> {record.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientHealthRecord;
