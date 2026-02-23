# 🌾 Intelligent Crop Yield Prediction System

An ML-based system that predicts crop yield using historical agricultural data including rainfall, temperature, pesticide usage, and crop type.

## Dataset

- **Source:** [Kaggle - Crop Yield Prediction Dataset](https://www.kaggle.com/datasets/patelris/crop-yield-prediction-dataset)
- **Records:** 28,242
- **Countries:** 101
- **Crops:** 10 (Maize, Rice, Wheat, Potatoes, Sorghum, Soybeans, Cassava, Sweet Potatoes, Plantains, Yams)

### Features

| Column | Description |
|--------|-------------|
| Area | Country/Region |
| Item | Crop type |
| Year | Year of record |
| average_rain_fall_mm_per_year | Average annual rainfall (mm) |
| pesticides_tonnes | Pesticides used (tonnes) |
| avg_temp | Average temperature (°C) |
| hg/ha_yield | **Target** — Yield in hectograms per hectare |

## System Architecture

```
CSV Data → Preprocessing → Model Training → Evaluation → Best Model → Streamlit UI
```

### Pipeline

1. **Data Preprocessing** — Load CSV, handle missing values, remove outliers, label encode categorical features (Area, Item), normalize with StandardScaler, 80/20 train-test split
2. **Model Training** — Train and evaluate 3 models:
   - Linear Regression (regression)
   - Decision Tree Regressor (regression)
   - Logistic Regression (classification — Low/Medium/High yield)
3. **Evaluation** — Compare using MAE, RMSE, R² (regression) and Accuracy (classification)
4. **Prediction** — Best model predicts yield from user inputs via Streamlit UI

## Project Structure

```
├── app.py                      # Streamlit web application
├── requirements.txt            # Python dependencies
├── README.md
├── data/
│   └── yield_df.csv            # Kaggle dataset
├── models/
│   ├── best_model.pkl          # Best regression model
│   ├── best_model_name.pkl     # Name of best model
│   ├── logistic_regression.pkl # Classification model
│   ├── encoders.pkl            # Label encoders
│   ├── scaler.pkl              # Feature scaler
│   ├── feature_names.pkl       # Feature list
│   ├── yield_thresholds.pkl    # Yield category thresholds
│   └── model_results.json      # Evaluation metrics
└── src/
    ├── data_preprocessing.py   # Data loading, cleaning, encoding
    ├── model_training.py       # Training and evaluation pipeline
    └── predict.py              # Inference module
```

## Setup and Installation

```bash
# Clone the repository
git clone <repo-url>
cd AI:ML

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## How to Run

### 1. Download Dataset

```python
import kagglehub
path = kagglehub.dataset_download("patelris/crop-yield-prediction-dataset")
print("Path to dataset files:", path)
```

Copy `yield_df.csv` from the downloaded path to the `data/` folder.

### 2. Train Models

```bash
python src/model_training.py
```

### 3. Run the Application

```bash
streamlit run app.py
```

The app will open at `http://localhost:8501`

## Model Performance

| Model | Type | MAE | RMSE | R² |
|-------|------|-----|------|----|
| Linear Regression | Regression | 58,632 | 74,996 | 0.0621 |
| **Decision Tree** | **Regression** | **4,020** | **11,784** | **0.9768** |
| Logistic Regression | Classification | — | — | Accuracy: 0.4306 |

**Best Model:** Decision Tree (R² = 0.9768)

## Application Pages

- **Home** — Project overview, dataset info, sample data
- **Data Explorer** — Upload CSV or explore built-in dataset with visualizations (yield by crop, by country, over time, correlations)
- **Predict Yield** — Enter crop, country, rainfall, pesticides, temperature → get predicted yield + yield category
- **Model Performance** — Compare all models with charts and metrics

## Tech Stack

- Python, Pandas, NumPy
- Scikit-learn (Linear Regression, Decision Tree, Logistic Regression)
- Streamlit (UI)
- Plotly (Charts)

## Team

- Arun Kumar
