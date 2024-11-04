// src/components/UserProfile.js
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Make sure to import auth and db from firebase.js
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './UserProfile.css';

function UserProfile() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    gender: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.error('No such user data found!');
          }
        } else {
          console.error('No user logged in!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Save changes to Firestore
  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), userData);
        setIsEditing(false);
        alert('User data updated successfully.');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      alert('Failed to update user data.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="user-profile-container">
      <h3>User Profile</h3>
      <div className="user-details">
        <div className="user-detail">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            disabled={!isEditing}
            onChange={handleInputChange}
          />
          {isEditing && <i className="fas fa-edit"></i>}
        </div>
        <div className="user-detail">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            disabled={!isEditing}
            onChange={handleInputChange}
          />
          {isEditing && <i className="fas fa-edit"></i>}
        </div>
        <div className="user-detail">
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={userData.age}
            disabled={!isEditing}
            onChange={handleInputChange}
          />
          {isEditing && <i className="fas fa-edit"></i>}
        </div>
        <div className="user-detail">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            disabled={true} // Email shouldn't be editable
            onChange={handleInputChange}
          />
          {isEditing && <i className="fas fa-edit"></i>}
        </div>
        <div className="user-detail">
          <label>Gender:</label>
          <select
            name="gender"
            value={userData.gender}
            disabled={!isEditing}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {isEditing && <i className="fas fa-edit"></i>}
        </div>
        <div className="button-group">
          {isEditing ? (
            <button className="btn-save" onClick={handleSave}>Save</button>
          ) : (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
