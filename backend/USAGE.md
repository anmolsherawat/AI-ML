# Usage and Installation Guide

## 1. Prerequisites
- Python 3.9+ installed
- A free API Key from [Groq](https://console.groq.com/keys) for the AI Farm Advisory Agent.

## 2. Local Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/crop-yield-agentic-advisory.git
   cd crop-yield-agentic-advisory
   ```

2. **Create a virtual environment (Recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables:**
   Create a `.env` file in the root directory and add your Groq API key (or you can input it directly in the app UI):
   ```
   GROQ_API_KEY=your_api_key_here
   ```

## 3. Running the Machine Learning Pipeline
Before launching the application, train the machine learning models. The training script uses Cross-Validation (GridSearchCV) to tune hyperparameters and calculate metrics (MAE, RMSE, R²).

```bash
python src/model_training.py
```
*This will generate the necessary `.pkl` and `.json` artifacts in the `models/` directory.*

## 4. Running the Streamlit Application
Launch the web interface using Streamlit:
```bash
streamlit run app.py
```

Navigate to `http://localhost:8501` in your browser. Use the sidebar to switch between Data Explorer, Prediction, Model Performance, and the Farm Advisory Agent.

## 5. Live Demo Deployment Notes
- **Hosting:** Deploy seamlessly to [Streamlit Community Cloud](https://streamlit.io/cloud) or Hugging Face Spaces.
- **Custom Domain:** You can configure a custom domain (e.g., `farm-advisory.yourdomain.com`) in your hosting provider's settings to improve professionalism.
- **Keeping App Awake:** On free-tier hosting (like Render or Render/HF Spaces), use a free cron service like [cron-job.org](https://cron-job.org) to ping your app URL every 14 minutes to prevent it from going to sleep.
