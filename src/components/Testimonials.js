import React, { useState, useEffect } from 'react';
import { getFeedbacks } from '../services/firebaseService'; // Import feedback service
import './Testimonials.css'; // Import styles for this section

function Testimonials() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const feedbackData = await getFeedbacks();
        setFeedbacks(feedbackData);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <section id="testimonials" className="testimonials-section">
      <h2 style={{ color: 'rgb(68, 67, 67)' }}>What Our Clients Say</h2>
      <div className="testimonials-grid">
        {feedbacks.map((feedback) => (
          <div className="testimonial-item" key={feedback.id}>
            <h3 style={{ color: 'rgb(68, 67, 67)' }}>{feedback.name}</h3>
            <p><strong>Rating:</strong> {feedback.rating} / 5</p>
            <p><strong>Email:</strong> {feedback.email}</p>
            <p><strong>Date:</strong> {new Date(feedback.date).toLocaleDateString()}</p>
            <p><strong>Experience:</strong> {feedback.experience}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
