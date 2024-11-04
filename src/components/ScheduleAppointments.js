import React, { useEffect, useState } from 'react';
import { addAppointment, getAvailableDoctors } from '../services/firebaseService';
import { auth } from '../firebase';
import './ScheduleAppointment.css'; // Optional: create a separate CSS file for styling

function ScheduleAppointment() {
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

  useEffect(() => {
    // Fetch available doctors
    const fetchData = async () => {
      setLoading(true);
      try {
        const doctorsResponse = await getAvailableDoctors();
        if (doctorsResponse && doctorsResponse.success) {
          setDoctors(doctorsResponse.data);
        } else {
          setFormError('Failed to retrieve doctors.');
        }
      } catch (error) {
        setFormError('Error fetching doctors.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes for new appointment
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

      // Add the appointment to both global and patient's collection
      await addAppointment(currentUser.uid, { doctorId, date, time, status: 'upcoming' });

      // Clear form after submission
      setNewAppointment({
        doctorId: '',
        date: '',
        time: '',
        status: 'upcoming',
      });
    } catch (error) {
      setFormError('Error adding appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading doctors...</p>;
  }

  return (
    <div className="schedule-appointment-container">
      <h3>Schedule an Appointment</h3>

      {/* Form for adding a new appointment */}
      <div className="add-appointment-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Doctor:</label>
            <select
              name="doctorId"
              value={newAppointment.doctorId}
              onChange={handleInputChange}
            >
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
            <input
              type="date"
              name="date"
              value={newAppointment.date}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Time:</label>
            <input
              type="time"
              name="time"
              value={newAppointment.time}
              onChange={handleInputChange}
            />
          </div>

          {formError && <p className="error">{formError}</p>}

          <button style={{backgroundColor: '#8A2BE2'}} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ScheduleAppointment;
