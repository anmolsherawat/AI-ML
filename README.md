# 🌾 Intelligent Crop Yield Prediction & Agentic Farm Advisory System

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.9%2B-blue.svg)
![Streamlit](https://img.shields.io/badge/streamlit-1.30%2B-red.svg)

An AI-driven agricultural analytics system that predicts crop yield using historical farm, soil, and weather data, and an **agentic AI farm advisory assistant** that generates structured crop management recommendations.

## 🚀 Live Demo
- **URL:** [Your Custom Domain / Hosting Link Here]
- **Video Walkthrough:** [Demo Video Link]

*(Add a GIF or screenshot of your Streamlit application here)*
> `![App Screenshot](assets/demo.gif)`

## 🎯 Project Objectives
1. **Milestone 1:** Build a machine learning system (incorporating Cross-Validation and Hyperparameter tuning) that predicts crop yield using historical agricultural, soil, and weather data. Advanced models (Random Forest, Gradient Boosting) are used for predictions.
2. **Milestone 2:** Extend the yield prediction system into an agentic AI assistant using LangGraph. The assistant reasons about farm conditions and generates actionable crop management advice (using free-tier Groq LLMs).

## 🛠️ Features
- **Data Exploration:** Interactive visualizations (correlation matrices, feature distributions) using Plotly.
- **Yield Prediction:** Regression models with feature importance plots and comprehensive evaluation metrics (MAE, RMSE, R²).
- **Agentic Advisory:** A LangGraph state-machine workflow that analyzes weather, soil inputs, and yields to generate structured, actionable agronomy reports.
- **PDF Export:** Users can download the structured advisory report as a PDF directly from the UI.
- **Modular Codebase:** `app.py` has been split into individual module pages for better maintainability and reusability.

## ⚙️ Installation & Usage
For complete local setup instructions, training the models, and running the application, please refer to the **[USAGE.md](USAGE.md)** file.

## 📊 Technical Implementation Highlights
- **Cross-Validation:** `GridSearchCV` is implemented in `src/model_training.py` to optimize model hyperparameters and improve generalizability.
- **Evaluation Metrics:** Added Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and R-squared to provide a comprehensive understanding of model performance.
- **Advanced ML Models:** Utilizes ensemble methods like `RandomForestRegressor` and `GradientBoostingRegressor`.
- **Feature Importance:** Dynamic Plotly visualizations are integrated to show the contribution of each feature to the predicted yield.
- **Continuous Target Only:** Replaced previous classification approaches to focus purely on the continuous yield prediction (hg/ha).
- **Custom Domain & Uptime:** Streamlit configuration optimizations to ensure the app stays awake and responsive.

## 📂 Project Structure
```
├── app.py                      # Main Streamlit application entrypoint
├── pages/                      # Streamlit multipage application modules
│   ├── 1_Data_Explorer.py      # Data visualization and info
│   ├── 2_Predict_Yield.py      # Machine Learning prediction UI
│   ├── 3_Model_Performance.py  # MAE, RMSE, R2, and Feature Importance
│   └── 4_Farm_Advisory_Agent.py# Agentic Advisory LLM workflow
├── src/                        # Core backend modules
│   ├── model_training.py       # CV, Hyperparameter tuning, Model training
│   ├── predict.py              # Prediction and artifact loading utilities
│   ├── data_preprocessing.py   # Data cleaning
│   ├── agent.py                # LangGraph Agent workflow
│   ├── utils.py                # PDF Generation utilities
│   └── utils_ui.py             # Streamlit cache helpers
├── models/                     # Saved model artifacts (.pkl, .json)
├── data/                       # CSV Datasets
├── USAGE.md                    # Setup and installation instructions
├── requirements.txt            # Python dependencies
└── .gitignore                  # Git ignore definitions
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.
