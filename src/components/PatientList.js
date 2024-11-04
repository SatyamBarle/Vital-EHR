import React, { useEffect, useState } from 'react';
import { getPatientsForDoctor } from '../services/firebaseService'; // Firebase service to get patients for the doctor
import { auth } from '../firebase'; // Firebase authentication to get the current logged-in user
import './PatientList.css';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError('');

      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setError('No user is logged in.');
          setLoading(false);
          return;
        }

        const doctorId = currentUser.uid; // Assuming doctor is logged in
        const fetchedPatients = await getPatientsForDoctor(doctorId);

        if (fetchedPatients && fetchedPatients.length > 0) {
          console.log('Fetched patients:', fetchedPatients); // Log the patients data
          setPatients(fetchedPatients);
        } else {
          setError('No patients have booked appointments with you.');
        }
      } catch (error) {
        setError('Failed to fetch patient list.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="patient-list-container">
      <h2>Patients</h2>
      {loading ? (
        <p>Loading patient list...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : patients.length === 0 ? (
        <p>No patients have booked appointments with you.</p>
      ) : (
        <ul className="patient-list">
          {patients.map((patient) => (
            <li key={patient.appointmentId} className="patient-item">
              <h3>{patient.firstName} {patient.lastName}</h3>
              <p><strong>Age:</strong> {patient.age}</p>
              <p><strong>Email:</strong> {patient.email}</p>
              <p><strong>Appointment Date:</strong> {patient.date}</p>
              <p><strong>Appointment Time:</strong> {patient.time}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PatientList;
