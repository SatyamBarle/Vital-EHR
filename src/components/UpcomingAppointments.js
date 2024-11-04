import React, { useEffect, useState } from 'react';
import { getUpcomingAppointments, addAppointment, getAvailableDoctors, deleteAppointment } from '../services/firebaseService';
import { auth } from '../firebase';
import './UpcomingAppointments.css';

function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    doctorId: '',
    date: '',
    time: '',
    status: 'upcoming',
  });
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to handle modal visibility

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setLoading(false);
        setFormError('No user is logged in.');
        return;
      }

      try {
        // Fetch upcoming appointments
        const appointmentsResponse = await getUpcomingAppointments(currentUser.uid);
        if (appointmentsResponse && appointmentsResponse.success) {
          setAppointments(appointmentsResponse.data);
        } else {
          setFormError('Failed to retrieve upcoming appointments.');
        }

        // Fetch available doctors
        const doctorsResponse = await getAvailableDoctors();
        if (doctorsResponse && doctorsResponse.success) {
          setDoctors(doctorsResponse.data);
        } else {
          setFormError('Failed to retrieve doctors.');
        }
      } catch (error) {
        setFormError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
  };

  // Handle adding a new appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    const { doctorId, date, time } = newAppointment;
    if (!doctorId || !date || !time) {
      setFormError('All fields are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setFormError('No user is logged in.');
        setIsSubmitting(false);
        return;
      }

      // Add appointment
      await addAppointment(currentUser.uid, { doctorId, date, time, status: 'upcoming' });

      // Update appointments list
      const updatedAppointments = await getUpcomingAppointments(currentUser.uid);
      if (updatedAppointments && updatedAppointments.success) {
        setAppointments(updatedAppointments.data);
      }

      // Reset form and close modal
      setNewAppointment({
        doctorId: '',
        date: '',
        time: '',
        status: 'upcoming',
      });
      setShowModal(false);
    } catch (error) {
      setFormError('Error adding appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting an appointment
  const handleDelete = async (appointmentId) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setFormError('No user is logged in.');
        return;
      }

      await deleteAppointment(currentUser.uid, appointmentId);
      setAppointments((prevData) => prevData.filter((appointment) => appointment.id !== appointmentId));
    } catch (error) {
      setFormError('Error deleting appointment. Please try again.');
    }
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  if (loading) {
    return <p>Loading upcoming appointments...</p>;
  }

  if (formError) {
    return <p>{formError}</p>;
  }

  return (
    <div className="upcoming-appointments-container">
      <h3>Upcoming Appointments</h3>

      {/* List of upcoming appointments */}
      <div className="appointments-list">
        {appointments.length === 0 ? (
          <p>No upcoming appointments.</p>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="appointment-item">
              <h4>Doctor: {doctors.find((doctor) => doctor.id === appointment.doctorId)?.firstName} {doctors.find((doctor) => doctor.id === appointment.doctorId)?.lastName}</h4>
              <p>Date: {appointment.date}</p>
              <p>Time: {appointment.time}</p>
              <button onClick={() => handleDelete(appointment.id)}>Cancel</button>
            </div>
          ))
        )}
      </div>

      {/* Button to open the scheduling modal */}
      <button className="schedule-btn" onClick={toggleModal}>
        Schedule Appointment
      </button>

      {/* Modal for scheduling appointments */}
      {showModal && (
        <div className="appointment-modal">
          <div className="modal-content">
            <h4>Schedule New Appointment</h4>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Doctor:</label>
                <select name="doctorId" value={newAppointment.doctorId} onChange={handleInputChange}>
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date:</label>
                <input type="date" name="date" value={newAppointment.date} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Time:</label>
                <input type="time" name="time" value={newAppointment.time} onChange={handleInputChange} />
              </div>
              {formError && <p className="error">{formError}</p>}
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Appointment'}
              </button>
              <button className="close-modal-btn" onClick={toggleModal}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpcomingAppointments;
