import React, { useEffect, useState } from 'react';
import { getAppointmentsForDoctor, updateAppointment, deleteAppointment } from '../services/firebaseService'; // Import services
import { auth } from '../firebase'; // Firebase auth
import './AppointmentManager.css'; // Styling

function AppointmentManager() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');

  // Fetch appointments for the logged-in doctor
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setLoading(false);
        setFormError('No user is logged in.');
        return;
      }

      try {
        const appointmentsResponse = await getAppointmentsForDoctor(currentUser.uid);
        if (appointmentsResponse && appointmentsResponse.success) {
          // Ensure appointmentId is set correctly
          const appointmentsWithIds = appointmentsResponse.data.map((appointment) => ({
            ...appointment,
            appointmentId: appointment.id, // Ensuring appointmentId is included
          }));
          setAppointments(appointmentsWithIds);
        } else {
          setFormError('Failed to retrieve appointments.');
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setFormError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Handle changes in the form fields for updating appointments
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedAppointment({ ...selectedAppointment, [name]: value });
  };

  const handleSaveChanges = async () => {
    if (!selectedAppointment.date || !selectedAppointment.time) {
      setFormError('Both date and time are required.');
      return;
    }

    if (!selectedAppointment.appointmentId) {
      console.error('Error: appointmentId is missing.');
      setFormError('Appointment ID is missing. Cannot update appointment.');
      return;
    }

    try {
      await updateAppointment(selectedAppointment.patientId, selectedAppointment.appointmentId, {
        date: selectedAppointment.date,
        time: selectedAppointment.time,
      });

      // Update the appointments in the state after a successful save
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.appointmentId === selectedAppointment.appointmentId
            ? { ...appointment, date: selectedAppointment.date, time: selectedAppointment.time }
            : appointment
        )
      );

      setSelectedAppointment(null); // Clear the selected appointment after updating
      console.log('Appointment updated successfully');
    } catch (error) {
      console.error('Error updating appointment:', error);
      setFormError('Error updating appointment.');
    }
  };

  // Handle deleting an appointment
  const handleCancelAppointment = async (appointmentId) => {
    // Ensure selectedAppointment and patientId exist
    const appointmentToCancel = appointments.find(appointment => appointment.appointmentId === appointmentId);

    if (!appointmentToCancel || !appointmentToCancel.patientId) {
      console.log("Selected appointment or Patient ID is missing:", appointmentToCancel);
      setFormError('Patient ID or selected appointment is missing. Cannot cancel appointment.');
      return;
    }

    try {
      console.log("Canceling appointment with ID:", appointmentId, "for patient:", appointmentToCancel.patientId);
      await deleteAppointment(appointmentToCancel.patientId, appointmentId);
      
      // Remove the canceled appointment from the appointments list
      setAppointments((prevAppointments) => prevAppointments.filter((appointment) => appointment.appointmentId !== appointmentId));
      setSelectedAppointment(null); // Clear the selected appointment after canceling
      console.log('Appointment canceled successfully');
    } catch (error) {
      console.error('Error canceling appointment:', error);
      setFormError('Error canceling appointment.');
    }
  };

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  if (formError) {
    return <p className="error-message">{formError}</p>;
  }

  return (
    <div className="appointment-manager-container">
      <h2>Appointment Manager</h2>

      {/* List of appointments */}
      <div className="appointments-list">
        {appointments.length === 0 ? (
          <p>No upcoming appointments.</p>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.appointmentId} className="appointment-item">
              <h4>Patient: {appointment.patientName}</h4>
              <p>Date: {appointment.date}</p>
              <p>Time: {appointment.time}</p>
              <button onClick={() => setSelectedAppointment(appointment)}>Edit</button>
              <button onClick={() => handleCancelAppointment(appointment.appointmentId)}>Cancel</button>
            </div>
          ))
        )}
      </div>

      {/* Edit appointment section */}
      {selectedAppointment && (
        <div className="edit-appointment-section">
          <h3>Edit Appointment</h3>
          <form>
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={selectedAppointment.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Time:</label>
              <input
                type="time"
                name="time"
                value={selectedAppointment.time}
                onChange={handleInputChange}
              />
            </div>
            {formError && <p className="error">{formError}</p>}
            <button type="button" onClick={handleSaveChanges}>
              Save Changes
            </button>
            <button type="button" onClick={() => handleCancelAppointment(selectedAppointment.appointmentId)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AppointmentManager;
