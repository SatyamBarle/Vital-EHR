import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Importing Firebase config
import './SignUp.css';

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    email: '',
    medicalHistory: '',
    userType: '', // User type can be "Patient" or "Doctor"
    password: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    // Basic form validation
    if (!formData.firstName) validationErrors.firstName = 'First Name is required';
    if (!formData.lastName) validationErrors.lastName = 'Last Name is required';
    if (!formData.age || formData.age <= 0) validationErrors.age = 'Valid age is required';
    if (!formData.gender) validationErrors.gender = 'Gender is required';
    if (!validateEmail(formData.email)) validationErrors.email = 'Valid email is required';
    if (!formData.userType) validationErrors.userType = 'User Type is required';
    if (!formData.password || formData.password.length < 6) validationErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Register the user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // Store user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          age: formData.age,
          gender: formData.gender,
          email: formData.email,
          medicalHistory: formData.medicalHistory, // Medical history (for patients)
          userType: formData.userType, // Either Patient or Doctor
          userId: user.uid
        });

        // If the user is a patient, add their details to the 'patients' collection
        if (formData.userType === 'Patient') {
          // Add patient details to the 'patients' collection
          await setDoc(doc(db, 'patients', user.uid), {
            firstName: formData.firstName,
            lastName: formData.lastName,
            age: formData.age,
            gender: formData.gender,
            email: formData.email,
            medicalHistory: formData.medicalHistory,
            userId: user.uid
          });

          // Add initial medical history to their 'history' sub-collection
          const patientHistoryRef = collection(db, 'patients', user.uid, 'history');
          await addDoc(patientHistoryRef, {
            title: 'Initial Medical History',
            description: formData.medicalHistory,
            date: new Date().toISOString()
          });
        }

        // If the user is a doctor, create a separate entry in the 'doctors' collection
        if (formData.userType === 'Doctor') {
          await setDoc(doc(db, 'doctors', user.uid), {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            specialization: '',
            experience: '',
            qualifications: '',
            userId: user.uid
          });
        }

        console.log('User registered and data saved:', formData);
        // After successful signup, navigate to the login page
        navigate('/login');
      } catch (error) {
        console.error('Error creating user:', error);
        setErrors({ general: 'Failed to sign up. Please try again later.' });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} />
          {errors.age && <span className="error">{errors.age}</span>}
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <span className="error">{errors.gender}</span>}
        </div>
        <div className="form-group">
          <label>Email Address:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        {formData.userType === 'Patient' && (
          <div className="form-group">
            <label>Medical History:</label>
            <textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} />
          </div>
        )}
        <div className="form-group">
          <label>User Type:</label>
          <select name="userType" value={formData.userType} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
          </select>
          {errors.userType && <span className="error">{errors.userType}</span>}
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        {errors.general && <div className="error general">{errors.general}</div>}
        <button type="submit" className="btn-submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default SignUp;
