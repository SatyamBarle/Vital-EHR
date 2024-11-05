import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "your_api",
    authDomain: "vital-ehr.firebaseapp.com",
    projectId: "vital-ehr",
    storageBucket: "vital-ehr.appspot.com",
    messagingSenderId: "903340031021",
    appId: "1:903340031021:web:92403d3b2ab9f61a614ca4"
  };

  // initialization Firebase 
  const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };