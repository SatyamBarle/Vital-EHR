import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Use Auth context
import { getDoctorProfile, updateDoctorProfile } from '../services/firebaseService';
import './DoctorProfile.css';

function DoctorProfile() {
  const { currentUser } = useAuth(); // Get the current user
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    experience: '',
    qualifications: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch doctor profile when component mounts
    const fetchDoctorProfile = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const profile = await getDoctorProfile(currentUser.uid);
          setProfileData(profile);
        } catch (err) {
          setError('Failed to load profile');
        }
      }
    };

    fetchDoctorProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUser.uid) {
      setError('Unable to update profile, no authenticated user.');
      return;
    }

    try {
      await updateDoctorProfile(currentUser.uid, profileData);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return (
    <div className="doctor-profile">
      <h2>Doctor Profile</h2>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input type="text" name="firstName" value={profileData.firstName} onChange={handleChange} />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="lastName" value={profileData.lastName} onChange={handleChange} />
        </div>
        <div>
          <label>Specialization:</label>
          <input type="text" name="specialization" value={profileData.specialization} onChange={handleChange} />
        </div>
        <div>
          <label>Experience:</label>
          <input type="text" name="experience" value={profileData.experience} onChange={handleChange} />
        </div>
        <div>
          <label>Qualifications:</label>
          <input type="text" name="qualifications" value={profileData.qualifications} onChange={handleChange} />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default DoctorProfile;
