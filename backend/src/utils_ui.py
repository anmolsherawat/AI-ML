import streamlit as st
import os
import sys
import json
import joblib

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src'))
from data_preprocessing import load_data
from predict import load_model

@st.cache_data
def get_data():
    return load_data()

@st.cache_resource
def get_model_artifacts():
    models_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')
    if not os.path.exists(os.path.join(models_dir, 'best_model.pkl')):
        return None, None, None, None, None, None
    model, model_name, encoders, scaler, features = load_model()
    
    results_path = os.path.join(models_dir, 'model_results.json')
    if os.path.exists(results_path):
        with open(results_path) as f:
            results = json.load(f)
    else:
        results = {}
        
    return model, model_name, encoders, scaler, features, results
