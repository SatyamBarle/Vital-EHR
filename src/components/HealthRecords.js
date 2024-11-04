import React, { useState, useEffect } from 'react';
import { getHealthRecordsForPatient } from '../services/firebaseService'; // Import service to fetch health records
import { auth } from '../firebase'; // Firebase authentication
import './HealthRecords.css'; // Import styles

function PatientHealthRecord() {
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');

  // Fetch health records for the logged-in patient
  useEffect(() => {
    const fetchHealthRecords = async () => {
      setLoading(true);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setLoading(false);
        setFormError('No user is logged in.');
        return;
      }

      try {
        const fetchedRecords = await getHealthRecordsForPatient(currentUser.uid);
        if (fetchedRecords.length > 0) {
          setHealthRecords(fetchedRecords);
        } else {
          setFormError('No health records found.');
        }
      } catch (error) {
        console.error('Error fetching health records:', error);
        setFormError('Failed to fetch health records.');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthRecords();
  }, []);

  if (loading) {
    return <p>Loading health records...</p>;
  }

  if (formError) {
    return <p className="error-message">{formError}</p>;
  }

  return (
    <div className="health-records-container">
      <h3>Your Health Records</h3>
      <div className="records-list">
        {healthRecords.length === 0 ? (
          <p>No health records found.</p>
        ) : (
          healthRecords.map((record) => (
            <div key={record.id} className="record-item">
              <h4>{record.title}</h4>
              <p>{record.description}</p>
              <p className="record-date">{new Date(record.date).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PatientHealthRecord;
