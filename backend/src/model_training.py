import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def train_models():
    print("Loading data...")
    base_dir = os.path.dirname(os.path.dirname(__file__))
    data_path = os.path.join(base_dir, 'data', 'yield_df.csv')
    df = pd.read_csv(data_path)
    if 'Unnamed: 0' in df.columns:
        df.drop(columns=['Unnamed: 0'], inplace=True)
    
    print("Preprocessing data...")
    # Features and Target
    features = ['Area', 'Item', 'Year', 'average_rain_fall_mm_per_year', 'pesticides_tonnes', 'avg_temp']
    target = 'hg/ha_yield'
    
    X = df[features].copy()
    y = df[target].values
    
    # Encode Categorical variables
    encoders = {}
    for col in ['Area', 'Item']:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        encoders[col] = le
        
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Define models and hyperparameters for GridSearch (Cross-Validation)
    models = {
        'Linear Regression': {
            'model': LinearRegression(),
            'params': {}
        },
        'Random Forest': {
            'model': RandomForestRegressor(random_state=42),
            'params': {
                'n_estimators': [50, 100],
                'max_depth': [None, 10, 20]
            }
        },
        'Gradient Boosting': {
            'model': GradientBoostingRegressor(random_state=42),
            'params': {
                'n_estimators': [100],
                'learning_rate': [0.05, 0.1]
            }
        }
    }
    
    results = {}
    best_model_name = None
    best_model = None
    best_score = -np.inf
    
    print("Training and tuning models using Cross-Validation...")
    for name, config in models.items():
        print(f"Training {name}...")
        grid = GridSearchCV(
            estimator=config['model'], 
            param_grid=config['params'], 
            cv=3, # 3-fold cross-validation
            scoring='r2',
            n_jobs=-1
        )
        grid.fit(X_train_scaled, y_train)
        
        # Best model from grid search
        model = grid.best_estimator_
        y_pred = model.predict(X_test_scaled)
        
        # Metrics
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        
        # Feature Importance
        feature_importance = {}
        if hasattr(model, 'feature_importances_'):
            for i, col in enumerate(features):
                feature_importance[col] = float(model.feature_importances_[i])
        elif hasattr(model, 'coef_'):
            for i, col in enumerate(features):
                feature_importance[col] = float(abs(model.coef_[i]))
                
        results[name] = {
            'type': 'regression',
            'metrics': {
                'MAE': mae,
                'RMSE': rmse,
                'R2': r2
            },
            'best_params': grid.best_params_,
            'feature_importance': feature_importance
        }
        
        print(f"  R2: {r2:.4f} | MAE: {mae:.2f} | RMSE: {rmse:.2f}")
        
        if r2 > best_score:
            best_score = r2
            best_model_name = name
            best_model = model
            
    print(f"\nBest Model: {best_model_name} (R2 = {best_score:.4f})")
    
    # Save artifacts
    print("Saving models and artifacts...")
    models_dir = os.path.join(base_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(best_model, os.path.join(models_dir, 'best_model.pkl'))
    joblib.dump(best_model_name, os.path.join(models_dir, 'best_model_name.pkl'))
    joblib.dump(encoders, os.path.join(models_dir, 'encoders.pkl'))
    joblib.dump(scaler, os.path.join(models_dir, 'scaler.pkl'))
    joblib.dump(features, os.path.join(models_dir, 'feature_names.pkl'))
    
    with open(os.path.join(models_dir, 'model_results.json'), 'w') as f:
        json.dump(results, f, indent=4)
        
    # Remove old classification files if they exist
    old_log_path = os.path.join(models_dir, 'logistic_regression.pkl')
    if os.path.exists(old_log_path):
        os.remove(old_log_path)
        
    print("Training complete!")

if __name__ == "__main__":
    train_models()
