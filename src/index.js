import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './App.css';
import reportWebVitals from './reportWebVitals';
import { FirebaseProvider } from './context/FirebaseContext';
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <FirebaseProvider>
        <App />
      </FirebaseProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
