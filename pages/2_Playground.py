import streamlit as st
import numpy as np
from utils.model import LogisticClassifier, RandomForestClassifier

st.set_page_config(
    page_title="Playground - Binary Classifier",
    page_icon="🎮",
    layout="wide"
)

st.title("Model Playground")

# Model selection
model_type = st.selectbox(
    "Select Model",
    ["Logistic Regression", "Random Forest"]
)

# Input features
st.subheader("Input Features")
col1, col2 = st.columns(2)

with col1:
    feature1 = st.number_input("Feature 1", value=0.0)
    feature2 = st.number_input("Feature 2", value=0.0)

with col2:
    feature3 = st.number_input("Feature 3", value=0.0)
    feature4 = st.number_input("Feature 4", value=0.0)

# Create input array
X = np.array([[feature1, feature2, feature3, feature4]])

# Model initialization and prediction
if st.button("Predict"):
    try:
        model = (LogisticClassifier() if model_type == "Logistic Regression" 
                else RandomForestClassifier())
        
        # For demonstration, we'll use some dummy training data
        X_train = np.random.rand(100, 4)
        y_train = np.random.randint(0, 2, 100)
        
        model.fit(X_train, y_train)
        prediction = model.predict(X)
        probability = model.predict_proba(X)
        
        st.subheader("Results")
        col1, col2 = st.columns(2)
        
        with col1:
            st.metric("Prediction", "Class 1" if prediction[0] == 1 else "Class 0")
        
        with col2:
            st.metric("Confidence", f"{probability[0][1]:.2%}")
            
    except Exception as e:
        st.error(f"An error occurred: {str(e)}")
