import React, { useState, useEffect } from 'react';
import { getAvailableDoctorsx} from '../services/firebaseService'; // Fetch doctors from Firestore
import './AvailableDoctors.css'; // For styling the component

function AvailableDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const doctorsData = await getAvailableDoctorsx();
        setDoctors(doctorsData);
      } catch (error) {
        setError('Error fetching doctors.');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <p>Loading doctors...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="available-doctors-container">
      <h2>Available Doctors</h2>
      <div className="doctors-list">
        {doctors.length === 0 ? (
          <p>No doctors available at the moment.</p>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <h3>{doctor.firstName} {doctor.lastName}</h3>
              <p><strong>Specialization:</strong> {doctor.specialization}</p>
              <p><strong>Experience:</strong> {doctor.experience} years</p>
              <p><strong>Email:</strong> {doctor.email}</p>
              {/* Add more fields as necessary */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AvailableDoctors;
