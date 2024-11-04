import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore'; // Firestore methods
import { db } from '../firebase'; // Import Firestore database
import './FeedBackReviews.css'; // Add your styles here

function FeedBackReviews() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    experience: ''
  });

  const [formError, setFormError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle changes to form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle rating change (star rating)
  const handleRatingChange = (newRating) => {
    setFormData({ ...formData, rating: newRating });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.experience || formData.rating === 0) {
      setFormError('Please fill in all fields.');
      return;
    }

    try {
      // Save feedback to Firestore
      await addDoc(collection(db, 'feedbacks'), {
        name: formData.name,
        email: formData.email,
        rating: formData.rating,
        experience: formData.experience,
        date: new Date().toISOString(), // Add a timestamp
      });

      // Show success message and reset form
      setIsSubmitted(true);
      setFormData({ name: '', email: '', rating: 0, experience: '' });
    } catch (error) {
      console.error('Error saving feedback:', error);
      setFormError('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="feedback-container">
      <h2>Share Your Experience</h2>

      {isSubmitted ? (
        <p className="success-message">Thank you for your feedback!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Rate your experience:</label>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${formData.rating >= star ? 'filled' : ''}`}
                  onClick={() => handleRatingChange(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Describe your experience:</label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
            />
          </div>

          {formError && <p className="error-message">{formError}</p>}

          <button type="submit" className="submit-button">Submit Feedback</button>
        </form>
      )}
    </div>
  );
}

export default FeedBackReviews;
