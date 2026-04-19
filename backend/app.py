import streamlit as st

st.set_page_config(
    page_title="Intelligent Crop Yield Prediction",
    page_icon="🌾",
    layout="wide"
)

st.title("🌾 Intelligent Crop Yield Prediction System")
st.markdown("""
Welcome to the **Intelligent Crop Yield Prediction and Agentic Farm Advisory System**.
This application predicts crop yield using advanced machine learning models trained on historical agricultural data, and provides personalized agronomy advice using an AI Agent.

### Navigation
- **Data Explorer:** Upload and explore agricultural data. View feature distributions, correlations, and basic statistics.
- **Predict Yield:** Enter farm conditions (rainfall, temperature, crop type, etc.) to get a predicted crop yield using our best ML model.
- **Model Performance:** Evaluate the performance of different models (e.g., Random Forest, Gradient Boosting) trained on the dataset. Check metrics like MAE, RMSE, and R².
- **Farm Advisory Agent:** Get structured, actionable crop management recommendations based on your specific farm conditions and the predicted yield.
""")

st.subheader("About the Dataset")
st.markdown("""
- **Source:** [Kaggle - Crop Yield Prediction Dataset](https://www.kaggle.com/datasets/patelris/crop-yield-prediction-dataset)
- **Records:** 28,242 entries
- **Countries:** 101 
- **Crops:** 10 major crops (Maize, Rice, Wheat, Potatoes, etc.)
- **Features:** Rainfall, Temperature, Pesticide usage, Year
- **Target:** Crop yield in hg/ha
""")

st.subheader("How it works")
st.markdown("""
1. **Data Preprocessing** — Clean data, encode categories, normalize features.
2. **Model Training** — Train ML models with Cross-Validation and Hyperparameter tuning.
3. **Evaluation** — Compare models using MAE, RMSE, and R² metrics. Feature importances highlight key yield drivers.
4. **Prediction & Advisory** — Use the best model to predict yield for new inputs, then generate AI-driven farm advice.
""")
