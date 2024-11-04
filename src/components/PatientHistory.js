import React, { useEffect, useState } from 'react';
import { getPatientHistory, addPatientHistory } from '../services/firebaseService'; 
import { auth } from '../firebase';
import './PatientHistory.css';

function PatientHistory() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newHistory, setNewHistory] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().substring(0, 10),
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError('No user is logged in.');
        setLoading(false);
        return;
      }

      try {
        const historyResponse = await getPatientHistory(currentUser.uid);
        if (historyResponse && historyResponse.success) {
          setHistoryData(historyResponse.data);
        } else {
          setError('Failed to retrieve patient history.');
        }
      } catch (err) {
        setError('Error fetching patient history.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHistory({ ...newHistory, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    const { title, description, date } = newHistory;
    if (!title || !description || !date) {
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

      // Store the date as a string in 'YYYY-MM-DD' format
      const formattedDate = new Date(date).toISOString().substring(0, 10);

      await addPatientHistory(currentUser.uid, {
        title,
        description,
        date: formattedDate, // Store date as string
      });

      // Update the history list after adding a new record
      setHistoryData((prevData) => [
        ...prevData,
        { id: Date.now(), title, description, date: formattedDate },
      ]);

      setNewHistory({
        title: '',
        description: '',
        date: new Date().toISOString().substring(0, 10),
      });

    } catch (error) {
      setFormError('Error adding history. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
};





  if (loading) {
    return <p>Loading patient history...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="patient-history-container">
      <div className="history-form">
        <h4>Add New History</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={newHistory.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={newHistory.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={newHistory.date}
              onChange={handleInputChange}
            />
          </div>
          {formError && <p className="error">{formError}</p>}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add History'}
          </button>
        </form>
      </div>

      <div className="history-list">
        <h3>Patient History</h3>
        {historyData.length === 0 ? (
          <p>No history data available.</p>
        ) : (
          historyData.map((record) => (
            <div key={record.id} className="history-item">
              <h4>{record.title}</h4>
              <p>{record.description}</p>
              <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PatientHistory;
