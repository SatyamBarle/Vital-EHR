# backend/model_training.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import CountVectorizer
import pickle

# Load the dataset
df = pd.read_csv('backend/dataset.csv')

# Check the first few rows to ensure the dataset is loaded correctly
print(df.head())

# Convert 'symptoms' column (text) into a format the model can understand (e.g., bag-of-words)
# This creates a feature matrix where each unique symptom is a feature
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(df['symptoms'])  # Convert symptoms to feature vectors

# Use 'disease' as the target
y = df['disease']

# Split the dataset into training and testing sets (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Print the shapes of training and testing data to confirm
print("X_train shape:", X_train.shape)
print("X_test shape:", X_test.shape)

# backend/model_training.py (continued)

# Train a Random Forest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate the model (optional, to check the accuracy on test data)
accuracy = model.score(X_test, y_test)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Save the trained model as a .pkl file
with open('backend/symptom_checker_model.pkl', 'wb') as f:
    pickle.dump(model, f)

# Save the vectorizer as well, since you'll need it during prediction
with open('backend/vectorizer.pkl', 'wb') as f:
    pickle.dump(vectorizer, f)

print("Model and vectorizer saved successfully!")
