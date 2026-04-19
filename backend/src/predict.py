import os
import joblib
import pandas as pd

def load_model():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    models_dir = os.path.join(base_dir, 'models')
    
    try:
        model = joblib.load(os.path.join(models_dir, 'best_model.pkl'))
        model_name = joblib.load(os.path.join(models_dir, 'best_model_name.pkl'))
        encoders = joblib.load(os.path.join(models_dir, 'encoders.pkl'))
        scaler = joblib.load(os.path.join(models_dir, 'scaler.pkl'))
        features = joblib.load(os.path.join(models_dir, 'feature_names.pkl'))
        return model, model_name, encoders, scaler, features
    except Exception as e:
        print(f"Error loading models: {e}")
        return None, None, None, None, None

def predict_yield(area, item, year, rainfall, pesticides, avg_temp, model, encoders, scaler, features):
    area_enc = encoders['Area'].transform([area])[0]
    item_enc = encoders['Item'].transform([item])[0]
    
    input_data = pd.DataFrame(
        [[area_enc, item_enc, year, rainfall, pesticides, avg_temp]],
        columns=features
    )
    
    input_scaled = scaler.transform(input_data)
    prediction = model.predict(input_scaled)[0]
    
    feature_importance = {}
    if hasattr(model, 'feature_importances_'):
        for i, col in enumerate(features):
            feature_importance[col] = float(model.feature_importances_[i])
    elif hasattr(model, 'coef_'):
        for i, col in enumerate(features):
            feature_importance[col] = float(abs(model.coef_[i]))
            
    return {
        'yield_hg_ha': float(prediction),
        'yield_tonnes_ha': float(prediction) / 10000,
        'feature_importance': feature_importance
    }
