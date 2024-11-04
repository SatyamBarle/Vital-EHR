// src/components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../firebase'; // Import the Firebase auth and db object
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import './Login.css';

function Login({ setUserType }) { // Accept setUserType as a prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Function to validate email
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!email || !validateEmail(email)) {
      validationErrors.email = 'Please enter a valid email address';
    }
    if (!password || password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Sign in the user with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user data from Firestore to get the userType
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserType(userData.userType); // Set userType in the App state

          // Navigate to the appropriate dashboard based on userType
          if (userData.userType === 'Doctor') {
            navigate('/doctor-dashboard');
          } else if (userData.userType === 'Patient') {
            navigate('/patient-dashboard');
          } else {
            console.log('Login successful for user type:', userData.userType);
          }
        } else {
          console.log('No such user in Firestore!');
          setErrors({ general: 'No user found. Please check your credentials.' });
        }
      } catch (error) {
        console.error('Error during login:', error);
        setErrors({ general: 'Failed to log in. Please check your credentials.' });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div className="form-group">
          <label>User Type:</label>
          <select
            onChange={(e) => setUserType(e.target.value)}
            disabled
            value="Select from Database" // Updated as we are setting userType from database
          >
            <option value="">Fetching from Database...</option>
          </select>
        </div>
        <div className="form-group">
          <button type="submit" className="btn-login">Login</button>
        </div>
        {errors.general && <div className="error general">{errors.general}</div>}
        <div className="form-group">
          <Link to="/forgot-password" className="forgot-password">
            Forgot Password?
          </Link>
        </div>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;
