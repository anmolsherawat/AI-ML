import os
import sys
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add src to path to import agent
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

app = FastAPI(title="AgriVision API")

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Models on Startup
models_dir = os.path.join(os.path.dirname(__file__), 'models')
try:
    model = joblib.load(os.path.join(models_dir, 'best_model.pkl'))
    encoders = joblib.load(os.path.join(models_dir, 'encoders.pkl'))
    scaler = joblib.load(os.path.join(models_dir, 'scaler.pkl'))
    features = joblib.load(os.path.join(models_dir, 'feature_names.pkl'))
    
    # Pre-warm model and initialize Pandas to prevent timeout on first request
    import pandas as pd
    import numpy as np
    dummy_input = pd.DataFrame(np.zeros((1, len(features))), columns=features)
    dummy_scaled = scaler.transform(dummy_input)
    model.predict(dummy_scaled)
    print("✅ Models loaded and pre-warmed successfully")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    model, encoders, scaler, features = None, None, None, None

class PredictionRequest(BaseModel):
    area: str
    item: str
    year: int
    rainfall: float
    pesticides: float
    avg_temp: float

class AdvisoryRequest(PredictionRequest):
    groq_api_key: Optional[str] = None

@app.get("/")
def read_root():
    return {"message": "Welcome to the AgriVision API"}

@app.post("/api/predict")
def predict_yield(req: PredictionRequest):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded")

    import pandas as pd
    try:
        area_enc = encoders['Area'].transform([req.area])[0]
        item_enc = encoders['Item'].transform([req.item])[0]
        
        input_data = pd.DataFrame(
            [[area_enc, item_enc, req.year, req.rainfall, req.pesticides, req.avg_temp]],
            columns=features
        )
        
        input_scaled = scaler.transform(input_data)
        prediction = model.predict(input_scaled)[0]
        
        feature_importance = {}
        if hasattr(model, 'feature_importances_'):
            for i, col in enumerate(features):
                feature_importance[col] = float(model.feature_importances_[i])
                
        return {
            'yield_hg_ha': float(prediction),
            'yield_tonnes_ha': float(prediction) / 10000,
            'feature_importance': feature_importance
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/advisory")
def get_advisory(req: AdvisoryRequest):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded")
        
    # Use environment variable if present, otherwise fallback to request
    api_key = os.getenv("GROQ_API_KEY") or req.groq_api_key
    
    if not api_key:
        raise HTTPException(status_code=400, detail="Groq API Key is required")
        
    os.environ["GROQ_API_KEY"] = api_key
    
    try:
        # 1. Get Prediction First
        import pandas as pd
        area_enc = encoders['Area'].transform([req.area])[0]
        item_enc = encoders['Item'].transform([req.item])[0]
        
        input_data = pd.DataFrame(
            [[area_enc, item_enc, req.year, req.rainfall, req.pesticides, req.avg_temp]],
            columns=features
        )
        
        input_scaled = scaler.transform(input_data)
        predicted_yield = float(model.predict(input_scaled)[0])
        
        # 2. Run LangGraph Agent
        from agent import run_advisory_agent
        report = run_advisory_agent(
            crop=req.item, 
            country=req.area, 
            year=req.year,
            rainfall=req.rainfall, 
            pesticides=req.pesticides, 
            temperature=req.avg_temp, 
            predicted_yield=predicted_yield
        )
        
        return {"report": report}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
