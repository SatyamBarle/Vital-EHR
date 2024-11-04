import React, { useState, useEffect } from 'react';
import { getPatientsForDoctor, addHealthRecord } from '../services/firebaseService'; 
import { auth } from '../firebase'; 
import './HealthRecordUpdate.css'; // Updated CSS file

function HealthRecordUpdate() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [newRecord, setNewRecord] = useState({
    title: '',
    description: '',
    date: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setFormError('No doctor is logged in.');
          return;
        }

        const patientsResponse = await getPatientsForDoctor(currentUser.uid);
        if (patientsResponse && patientsResponse.length > 0) {
          setPatients(patientsResponse);
        } else {
          setFormError('No patients found.');
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
        setFormError('Error fetching patients.');
      }
    };
    fetchPatients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handleSaveRecord = async () => {
    if (!newRecord.title || !newRecord.description || !newRecord.date || !selectedPatientId) {
      setFormError('All fields are required, including selecting a patient.');
      return;
    }

    try {
      await addHealthRecord(selectedPatientId, newRecord);
      setNewRecord({
        title: '',
        description: '',
        date: '',
      });
      setSelectedPatientId('');
      console.log('Health record added successfully');
    } catch (error) {
      console.error('Error updating health record:', error);
      setFormError('Error updating health record.');
    }
  };

  return (
    <div className="health-record-update-container">
      <h2>Update Health Record</h2>

      {/* Patient Selection */}
      <div className="patient-selection form-group">
        <label>Select Patient:</label>
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
        >
          <option value="">Select a patient</option>
          {patients.map((patient) => (
            <option key={patient.patientId} value={patient.patientId}>
              {patient.firstName} {patient.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* Health Record Form */}
      <div className="health-record-form">
        <div className="form-group">
          <label>Record Title:</label>
          <input
            type="text"
            name="title"
            value={newRecord.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Record Description:</label>
          <textarea
            name="description"
            value={newRecord.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={newRecord.date}
            onChange={handleInputChange}
          />
        </div>

        {formError && <p className="error-message">{formError}</p>}

        <div className="button-group">
          <button className="btn-submit" onClick={handleSaveRecord}>
            Save Health Record
          </button>
          <button className="btn-cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default HealthRecordUpdate;
