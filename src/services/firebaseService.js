// src/services/firebaseService.js
import { auth, db } from '../firebase'; // Import Firebase auth and firestore instances
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
} from 'firebase/firestore';

// Service for handling Firebase operations

// User Authentication
export const signUpUser = async (formData) => {
  try {
    const { email, password } = formData;
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add additional user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      ...formData,
      userId: user.uid,
    });

    return { success: true, user };
  } catch (error) {
    console.error('Error signing up user:', error);
    throw new Error('Failed to sign up. Please try again later.');
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Error logging in user:', error);
    throw new Error('Failed to login. Please check your credentials.');
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error logging out user:', error);
    throw new Error('Failed to logout. Please try again later.');
  }
};

// Firestore CRUD Operations
// Add or Update User Profile
export const addUserProfile = async (userId, profileData) => {
  try {
    await setDoc(doc(db, 'users', userId), profileData, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error adding/updating user profile:', error);
    throw new Error('Failed to update user profile. Please try again later.');
  }
};

// Get User Profile
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      throw new Error('User profile not found.');
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('Failed to fetch user profile.');
  }
};

// Get Health Records
// Get health records for a specific patient
export const getHealthRecords = async (patientId) => {
  if (!patientId) {
    throw new Error("Patient ID is required to fetch health records.");
  }

  try {
    const healthRecordsRef = collection(db, 'patients', patientId, 'healthRecords');
    const querySnapshot = await getDocs(healthRecordsRef);

    // Ensure each health record has its Firestore document ID
    const healthRecords = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Adding document ID to each record
      ...doc.data(),
    }));

    console.log('Fetched Health Records:', healthRecords); // Log fetched health records
    return healthRecords;
  } catch (error) {
    console.error('Error fetching health records:', error);
    throw error;
  }
};





// Add an appointment for a patient in both global and patient's collection
export const addAppointment = async (patientId, appointmentData) => {
  try {
    // Add appointment to global 'appointments' collection
    const globalAppointmentRef = await addDoc(collection(db, 'appointments'), {
      ...appointmentData,
      patientId,
    });

    // Add appointment to the patient's 'appointments' sub-collection
    const patientAppointmentRef = collection(db, 'patients', patientId, 'appointments');
    await setDoc(doc(patientAppointmentRef, globalAppointmentRef.id), {
      ...appointmentData,
      appointmentId: globalAppointmentRef.id, // Save reference of the appointment in the global collection
    });

    console.log('Appointment added successfully');
  } catch (error) {
    console.error('Error adding appointment:', error);
    throw error;
  }
};



// Get Feedback Reviews
export const getFeedbackReviews = async () => {
  try {
    const reviewsSnapshot = await getDocs(collection(db, 'feedbackReviews'));
    return reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching feedback reviews:', error);
    throw error;
  }
};

// Fetch doctor profile
export const getDoctorProfile = async (doctorId) => {
  try {
    const doctorDoc = await getDoc(doc(db, 'doctors', doctorId));
    if (doctorDoc.exists()) {
      return doctorDoc.data();
    } else {
      throw new Error('Doctor profile not found.');
    }
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    throw error;
  }
};

// Update doctor profile
export const updateDoctorProfile = async (doctorId, profileData) => {
  try {
    await updateDoc(doc(db, 'doctors', doctorId), profileData);
    return { success: true };
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    throw error;
  }
};

// Fetch appointments for a doctor
export const getAppointmentsForDoctor = async (doctorId) => {
  try {
    const appointmentsRef = collection(db, 'appointments');
    const q = query(appointmentsRef, where('doctorId', '==', doctorId));
    const querySnapshot = await getDocs(q);

    const appointments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: appointments };
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return { success: false };
  }
};

// Get All Appointments
export const getAppointments = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'appointments'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw new Error('Failed to fetch appointments');
  }
};

// Add Health Record
/*export const addHealthRecord = async (patientId, healthRecordData) => {
  try {
    const healthRecordsRef = collection(db, `patients/${patientId}/healthRecords`);
    await addDoc(healthRecordsRef, healthRecordData);
  } catch (error) {
    console.error('Error adding health record:', error);
    throw new Error('Failed to add health record');
  }
};*/
export const addHealthRecord = async (patientId, healthRecordData) => {
  if (!patientId) {
    throw new Error('Patient ID is required to add a health record.');
  }

  try {
    console.log('Adding health record for patientId:', patientId); // Log to verify patientId
    const healthRecordsRef = collection(db, 'patients', patientId, 'healthRecords');
    await addDoc(healthRecordsRef, healthRecordData);
    console.log('Health record added successfully');
  } catch (error) {
    console.error('Error adding health record:', error);
    throw error; // Throw error to be caught in the calling function
  }
};




// Update Health Record
export const updateHealthRecord = async (patientId, recordId, updatedData) => {
  try {
    const healthRecordRef = doc(db, 'patients', patientId, 'healthRecords', recordId);
    await updateDoc(healthRecordRef, updatedData);
  } catch (error) {
    console.error('Error updating health record:', error);
    throw new Error('Failed to update health record');
  }
};

// Delete Health Record
export const deleteHealthRecord = async (patientId, recordId) => {
  try {
    const healthRecordRef = doc(db, 'patients', patientId, 'healthRecords', recordId);
    await deleteDoc(healthRecordRef);
  } catch (error) {
    console.error('Error deleting health record:', error);
    throw new Error('Failed to delete health record');
  }
};

// Add Patient History
export const addPatientHistory = async (patientId, historyData) => {
  try {
    const historyRef = collection(db, 'patients', patientId, 'history');
    await setDoc(doc(historyRef), historyData);
    return { success: true };
  } catch (error) {
    console.error('Error adding patient history:', error);
    throw new Error('Failed to add patient history. Please try again later.');
  }
};


// Fetch patients for a doctor based on appointments
// Fetch patients for a doctor based on appointments and include health records if available
export const getPatientsForDoctor = async (doctorId) => {
  try {
    // Fetch appointments where doctorId matches the current doctor's ID
    const appointmentsRef = collection(db, 'appointments');
    const q = query(appointmentsRef, where('doctorId', '==', doctorId));
    const appointmentSnapshots = await getDocs(q);

    if (appointmentSnapshots.empty) {
      console.log('No appointments found for doctor:', doctorId);
      return [];
    }

    // Fetch patients and their health records if available
    const patients = await Promise.all(
      appointmentSnapshots.docs.map(async (docSnap) => {
        const appointmentData = docSnap.data();
        console.log('Fetched appointment data:', appointmentData); // Log fetched appointment data

        const patientRef = doc(db, 'patients', appointmentData.patientId);
        const patientSnapshot = await getDoc(patientRef);

        if (patientSnapshot.exists()) {
          console.log('Fetched patient data:', patientSnapshot.data()); // Log fetched patient data

          // Fetch the health records subcollection for this patient
          const healthRecordsRef = collection(db, 'patients', appointmentData.patientId, 'healthRecords');
          const healthRecordsSnapshot = await getDocs(healthRecordsRef);

          const healthRecords = healthRecordsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Return the patient data along with their appointments and health records (if any)
          return {
            appointmentId: docSnap.id,
            ...appointmentData,
            ...patientSnapshot.data(),
            healthRecords, // Include health records in the returned data
          };
        } else {
          console.error(`Patient not found for ID: ${appointmentData.patientId}`);
          return null; // Skip if no patient data found
        }
      })
    );

    return patients.filter(Boolean); // Remove any null entries
  } catch (error) {
    console.error('Error fetching patients for doctor:', error);
    throw new Error('Failed to fetch patients for doctor.');
  }
};



// Get All Patients
export const getPatients = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'patients'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw new Error('Failed to fetch patients');
  }
};

// Get Patient History
export const getPatientHistory = async (patientId) => {
  try {
    const historyRef = collection(db, 'patients', patientId, 'history');
    const querySnapshot = await getDocs(historyRef);
    const history = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: history };
  } catch (error) {
    console.error('Error getting patient history:', error);
    throw new Error('Failed to fetch patient history.');
  }
};



// Update Patient History
export const updatePatientHistory = async (patientId, historyId, updatedData) => {
  try {
    const historyDocRef = doc(db, 'patients', patientId, 'history', historyId);
    await updateDoc(historyDocRef, updatedData);
    return { success: true };
  } catch (error) {
    console.error('Error updating patient history:', error);
    throw new Error('Failed to update patient history. Please try again later.');
  }
};

// Delete Patient History
export const deletePatientHistory = async (patientId, historyId) => {
  try {
    const historyDocRef = doc(db, 'patients', patientId, 'history', historyId);
    await deleteDoc(historyDocRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting patient history:', error);
    throw new Error('Failed to delete patient history. Please try again later.');
  }
};

// Fetch Available Doctors
export const getAvailableDoctors = async () => {
  try {
    const doctorsRef = collection(db, 'doctors');
    const querySnapshot = await getDocs(doctorsRef);
    const doctors = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: doctors };
  } catch (error) {
    console.error('Error fetching available doctors:', error);
    throw new Error('Failed to fetch available doctors.');
  }
};

// fetch doctor2 for list 
export const getAvailableDoctorsx = async () => {
  try {
    const doctorsRef = collection(db, 'doctors');
    const doctorSnapshots = await getDocs(doctorsRef);
    
    const doctors = doctorSnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return doctors;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw new Error('Failed to fetch doctors.');
  }
};

// Schedule Appointment
export const scheduleAppointment = async (patientId, appointmentData) => {
  try {
    const appointmentRef = collection(db, 'patients', patientId, 'appointments');
    await setDoc(doc(appointmentRef), appointmentData);
    return { success: true };
  } catch (error) {
    console.error('Error scheduling appointment:', error);
    throw new Error('Failed to schedule appointment. Please try again later.');
  }
};

// Get Upcoming Appointments
export const getUpcomingAppointments = async (patientId) => {
  try {
    const appointmentsRef = collection(db, 'patients', patientId, 'appointments');
    const q = query(appointmentsRef, where('status', '==', 'upcoming'));
    const querySnapshot = await getDocs(q);
    const appointments = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: appointments };
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    throw new Error('Failed to fetch upcoming appointments.');
  }
};
// Update an appointment in both global 'appointments' and patient's sub-collection
/*export const updateAppointment = async (patientId, appointmentId, updatedData) => {
  try {
    // Update appointment in global 'appointments' collection
    const globalAppointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(globalAppointmentRef, updatedData);

    // Update appointment in patient's 'appointments' sub-collection
    const patientAppointmentRef = doc(db, 'patients', patientId, 'appointments', appointmentId);
    await updateDoc(patientAppointmentRef, updatedData);

    console.log('Appointment updated successfully');
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw new Error('Failed to update appointment.');
  }
}; */

// Function to update a specific appointment
/*export const updateAppointment = async (patientId, appointmentId, updatedData) => {
  try {
    const appointmentDocRef = doc(db, 'patients', patientId, 'appointments', appointmentId);
    await updateDoc(appointmentDocRef, updatedData);
    return { success: true };
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw new Error('Failed to update appointment.');
  }
};*/

// Update appointment in both patient sub-collection and global appointments collection
export const updateAppointment = async (patientId, appointmentId, updatedData) => {
  try {
    // Update the appointment in the patient's sub-collection
    const patientAppointmentRef = doc(db, 'patients', patientId, 'appointments', appointmentId);
    await updateDoc(patientAppointmentRef, updatedData);

    // Update the appointment in the global 'appointments' collection
    const globalAppointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(globalAppointmentRef, updatedData);

    console.log('Appointment updated successfully in both patient and global collections');
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw new Error('Failed to update appointment.');
  }
};


// Update appointment in the global 'appointments' collection
export const updateGlobalAppointment = async (appointmentId, updatedData) => {
  try {
    const appointmentDocRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentDocRef, updatedData);
    return { success: true };
  } catch (error) {
    console.error('Error updating global appointment:', error);
    throw new Error('Failed to update appointment in the global collection.');
  }
};




// Function to delete an appointment from both the global 'appointments' collection and patient's sub-collection
// Function to delete an appointment
export const deleteAppointment = async (patientId, appointmentId) => {
  try {
    console.log("Attempting to delete from 'appointments' collection:", appointmentId);
    console.log("Attempting to delete from 'patients' sub-collection:", patientId, appointmentId);

    // Delete from the global 'appointments' collection
    await deleteDoc(doc(db, 'appointments', appointmentId));

    // Delete from the patient's 'appointments' sub-collection
    await deleteDoc(doc(db, 'patients', patientId, 'appointments', appointmentId));

    console.log('Appointment deleted successfully');
  } catch (error) {
    console.error('Error canceling appointment:', error);
    throw new Error('Failed to cancel appointment.');
  }
};




// Fetch health records for a specific patient
export const getHealthRecordsForPatient = async (patientId) => {
  try {
    const healthRecordsRef = collection(db, 'patients', patientId, 'healthRecords');
    const healthRecordSnapshots = await getDocs(healthRecordsRef);

    const records = healthRecordSnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return records;
  } catch (error) {
    console.error('Error fetching health records:', error);
    throw new Error('Failed to fetch health records.');
  }
};



// Fetch disease reports based on disease title and date range

/*export const getDiseaseReports = async (diseaseTitle, startDate, endDate) => {
  try {
    const patientsRef = collection(db, 'patients');
    const patientsSnapshot = await getDocs(patientsRef);

    let allDiseaseRecords = [];

    for (const patientDoc of patientsSnapshot.docs) {
      const healthRecordsRef = collection(db, 'patients', patientDoc.id, 'healthRecords');

      // Log patient ID and check if it's fetching the right data
      console.log(`Checking health records for patient: ${patientDoc.id}`);

      // Perform string-based date comparison (lexicographical order)
      const q = query(
        healthRecordsRef,
        where('title', '==', diseaseTitle), // Exact match for disease title
        where('date', '>=', startDate), // Date comparison in string format
        where('date', '<=', endDate)
      );

      const healthRecordsSnapshot = await getDocs(q);

      if (!healthRecordsSnapshot.empty) {
        console.log(`Found records for disease: ${diseaseTitle}`);

        // Map health records and include patient info
        const patientHealthRecords = healthRecordsSnapshot.docs.map(doc => ({
          ...doc.data(),
          patientId: patientDoc.id,
        }));

        allDiseaseRecords = [...allDiseaseRecords, ...patientHealthRecords];
      } else {
        console.log(`No records found for patient: ${patientDoc.id}`);
      }
    }

    console.log('All disease records fetched:', allDiseaseRecords); // Debug log
    return allDiseaseRecords;
  } catch (error) {
    console.error('Error fetching disease reports:', error);
    throw new Error('Failed to fetch disease reports.');
  }
}; */

export const getDiseaseReports = async (diseaseTitle, startDate, endDate) => {
  try {
    const patientsRef = collection(db, 'patients');
    const patientsSnapshot = await getDocs(patientsRef);

    let allDiseaseRecords = [];

    for (const patientDoc of patientsSnapshot.docs) {
      const healthRecordsRef = collection(db, 'patients', patientDoc.id, 'healthRecords');

      // Log patient ID and check if it's fetching the right data
      console.log(`Checking health records for patient: ${patientDoc.id}`);

      // Perform string-based date comparison (lexicographical order)
      const q = query(
        healthRecordsRef,
        where('title', '==', diseaseTitle), // Exact match for disease title
        where('date', '>=', startDate), // Date comparison in string format
        where('date', '<=', endDate)
      );

      const healthRecordsSnapshot = await getDocs(q);

      if (!healthRecordsSnapshot.empty) {
        console.log(`Found records for disease: ${diseaseTitle} for patient ${patientDoc.id}`);

        // Log the records found
        healthRecordsSnapshot.docs.forEach(doc => console.log('Found record:', doc.data()));

        const patientHealthRecords = healthRecordsSnapshot.docs.map(doc => ({
          ...doc.data(),
          patientId: patientDoc.id,
        }));

        allDiseaseRecords = [...allDiseaseRecords, ...patientHealthRecords];
      } else {
        console.log(`No records found for patient: ${patientDoc.id}`);
      }
    }

    console.log('All disease records fetched:', allDiseaseRecords);
    return allDiseaseRecords;
  } catch (error) {
    console.error('Error fetching disease reports:', error);
    throw new Error('Failed to fetch disease reports.');
  }
};

export const getFeedbacks = async () => {
  try {
    const feedbacksRef = collection(db, 'feedbacks');
    const feedbackSnapshots = await getDocs(feedbacksRef);
    
    const feedbacks = feedbackSnapshots.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    return feedbacks;
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    throw new Error('Unable to fetch feedbacks');
  }
};

