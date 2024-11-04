# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)  # Enable CORS for the whole app

# Load the trained model and vectorizer
with open('backend/symptom_checker_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('backend/vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

# Define the /predict endpoint
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    symptoms = data['symptoms']  # Get symptoms from the request

    # Convert symptoms string into a list (if submitted as a comma-separated string)
    symptoms_list = symptoms.split(',')

    # Convert symptoms into a format that the model can understand
    symptoms_vector = vectorizer.transform([', '.join(symptoms_list)])

    # Make the prediction
    predicted_disease = model.predict(symptoms_vector)[0]

    # Add a concluding statement based on the disease
    conclusion = ''
    if predicted_disease == 'flu':
        conclusion = 'Rest at home and drink plenty of fluids. Visit a doctor if symptoms worsen.'
    elif predicted_disease == 'bronchitis':
        conclusion = 'It is advisable to visit a doctor, especially if you experience breathing difficulties.'
    elif predicted_disease == 'measles':
        conclusion = 'Measles is serious. Please visit a doctor immediately.'
    else:
        conclusion = 'Consult a healthcare professional if symptoms persist.'

    return jsonify({'predicted_disease': predicted_disease, 'conclusion': conclusion})

if __name__ == '__main__':
    app.run(debug=True)
