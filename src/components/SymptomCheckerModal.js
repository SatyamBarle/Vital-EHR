// src/components/SymptomCheckerModal.js

import React, { useState } from 'react';
import axios from 'axios';
import  './SymptomCheckerModal.css';



const symptomsList = [
  "fever", "cough", "sore throat", "runny or stuffy nose", "muscle aches", "headache", "fatigue",
  "mucus production", "shortness of breath", "chest pain", "nausea", "vomiting", "lightheadedness",
  "sweating", "sudden weakness", "numbness on one side of the body", "confusion", "difficulty speaking",
  "trouble seeing in one eye", "severe headache", "lump", "unexplained weight loss", "changes in bowel habits",
  "bladder habits", "persistent cough", "indigestion", "unexplained bleeding or discharge", "increased thirst",
  "frequent urination", "blurred vision", "cuts that are slow to heal", "memory loss", "difficulty thinking",
  "changes in personality or behavior", "pain", "stiffness", "swelling", "inflammation in the joints",
  "conjunctivitis", "rash", "pink eye", "diarrhea", "jaundice", "liver damage", "death", "physical dependence on alcohol",
  "tolerance to alcohol", "withdrawal symptoms", "impaired judgment", "heart disease", "cancer", "sneezing", "itchy eyes",
  "itchy nose", "itchy throat", "itchy palate", "pale skin", "dizziness", "excessive worry", "fear", "anxiety", "wheezing",
  "chest tightness", "sensitivity to light", "extreme mood swings", "blood in the urine", "pain or burning when urinating",
  "urgency to urinate", "incontinence", "redness", "warmth", "difficulty breathing", "coughing up blood",
  "inflammation in bursa", "pain during sex", "elevated body temperature", "abdominal cramps", "sexually transmitted infection",
  "blisters on the genitals", "mouth", "congestion", "red eyes", "sadness", "hopelessness", "loss of interest in activities",
  "changes in appetite", "energy levels", "loose stools", "watery stools", "disturbance in eating behavior", "seizures",
  "burning", "swollen veins", "twisted veins", "rough growths on the skin", "burning during urination", "discharge from the penis",
  "discharge from the vagina", "inflammation in the eye", "decreased kidney function", "bulge in the wall of the aorta", 
  "tingling at the bite site", "difficulty swallowing", "hydrophobia", "aerophobia", "painful rash", "night sweats", "weight loss",
  "swollen lymph nodes", "tingling in the arms", "tingling in the legs", "painful urination", "increased pressure in the eye", 
  "vision loss", "damage to the kidneys", "tremors", "slow movement", "stiffness", "difficulty with balance", "coordination",
  "numbness", "sensitivity to cold", "itchy", "red skin", "inflamed skin", "bloating", "high blood pressure", "changes in urination",
  "hyperthyroidism", "hypothyroidism", "chronic autoimmune disease", "blisters", "itchiness", "rashes", "cramps",
  // Ensure the list contains all symptoms from your dataset
];

const SymptomCheckerModal = ({ closeModal }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');  // State for the search input
  const [showSymptomSelection, setShowSymptomSelection] = useState(false);  // State to toggle between welcome and symptom selection
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);  // State to handle checkbox for terms

  // Filter symptoms based on search term
  const filteredSymptoms = symptomsList.filter((symptom) =>
    symptom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle symptom selection
  const handleSymptomChange = (symptom) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(symptom)) {
        return prev.filter((s) => s !== symptom);  // Unselect symptom
      }
      return [...prev, symptom];  // Add symptom
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        symptoms: selectedSymptoms.join(','),
      });
      alert(`Diagnosis: ${response.data.predicted_disease}\nConclusion: ${response.data.conclusion}`);
    } catch (error) {
      console.error('There was an error making the prediction!', error);
    }
    closeModal();
  };

  return (
    <div className="modal">
      {/* Conditional rendering for the Welcome page vs Symptom Selection page */}
      {!showSymptomSelection ? (
        <div>
          <h2>Welcome</h2>
          <p class="large-text">
            Before using this symptom checker, please read carefully and accept our Terms and Services:
          </p>
          <ul>
            <li>This checkup is not a diagnosis.</li>
            <li>This checkup is for informational purposes and is not a qualified medical opinion.</li>
            <li>
             Make Sure to select atleast 3-4 Symptoms for better and accurate results.
            </li>
          </ul>
          <label>
            <input
              type="checkbox"
              checked={isTermsAccepted}
              onChange={() => setIsTermsAccepted(!isTermsAccepted)}
            />
            I agree to the Vital-ehr terms and conditions.
          </label>

          <div style={{ marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setShowSymptomSelection(true)}
              disabled={!isTermsAccepted}  // Disable button unless terms are accepted
              style={{ padding: '10px', marginRight: '10px' }}
            >
              Next
            </button>
            <button type="button" onClick={closeModal} style={{ padding: '10px' }}>
              Close
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2>Select Your Symptoms</h2>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search for symptoms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
          />

          {/* Scrollable list of filtered symptoms */}
          <div  className="scrollable-list" style={{ maxHeight: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
            {filteredSymptoms.map((symptom) => (
              <label key={symptom} style={{ display: 'block', marginBottom: '10px' }}>
                <input
                  type="checkbox"
                  value={symptom}
                  checked={selectedSymptoms.includes(symptom)}
                  onChange={() => handleSymptomChange(symptom)}
                />
                {symptom}
              </label>
            ))}
          </div>

          <button type="button" onClick={handleSubmit} style={{ marginTop: '20px' }}>
            Submit
          </button>
          <button type="button" onClick={closeModal} style={{ marginTop: '10px' }}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default SymptomCheckerModal;
