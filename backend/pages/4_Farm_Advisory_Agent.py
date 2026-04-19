import streamlit as st
import pandas as pd
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src'))
from utils_ui import get_data, get_model_artifacts
from predict import predict_yield

st.set_page_config(page_title="Farm Advisory Agent", page_icon="🤖", layout="wide")
st.title("🤖 Agentic AI Farm Advisory Assistant")

st.markdown("""
Get personalized, structured crop management recommendations based on your farm conditions and predicted yield.
This assistant analyzes your data and provides actionable agronomy advice.
""")

# Check for Groq API key
groq_api_key = os.getenv("GROQ_API_KEY") or st.sidebar.text_input("Groq API Key (required for agent)", type="password")

artifacts = get_model_artifacts()
if artifacts[0] is None:
    st.warning("Please train the predictive model first to get yield estimations.")
    st.stop()
    
model, model_name, encoders, scaler, features, results = artifacts
df = get_data()

st.subheader("Farm Details for Advisory")
col1, col2 = st.columns(2)
with col1:
    crop = st.selectbox("Crop Type", sorted(encoders['Item'].classes_), key="agent_crop")
    country = st.selectbox("Country", sorted(encoders['Area'].classes_), key="agent_country")
    year = st.slider("Year", 1960, 2030, 2024, key="agent_year")
with col2:
    if not df.empty:
        rain_val = round(float(df['average_rain_fall_mm_per_year'].median()), 1)
        pest_val = round(float(df['pesticides_tonnes'].median()), 1)
        temp_val = round(float(df['avg_temp'].median()), 1)
    else:
        rain_val, pest_val, temp_val = 1000.0, 100.0, 20.0
        
    rainfall = st.number_input("Avg Rainfall (mm/year)", value=rain_val, key="agent_rain")
    pesticides = st.number_input("Pesticides (tonnes)", value=pest_val, key="agent_pest")
    temperature = st.number_input("Avg Temperature (°C)", value=temp_val, key="agent_temp")

if st.button("Generate Advisory Report", type="primary"):
    if not groq_api_key:
        st.error("Please enter a Groq API Key in the sidebar to use the AI Agent.")
        st.stop()
        
    os.environ["GROQ_API_KEY"] = groq_api_key
    
    with st.spinner("Analyzing farm conditions and generating advice..."):
        try:
            # 1. Get Prediction
            result = predict_yield(
                area=country, item=crop, year=year,
                rainfall=rainfall, pesticides=pesticides, avg_temp=temperature,
                model=model, encoders=encoders, scaler=scaler, features=features
            )
            predicted_yield = result['yield_hg_ha']

            # 2. Call the Agent
            try:
                from agent import run_advisory_agent
                report = run_advisory_agent(
                    crop=crop, country=country, year=year,
                    rainfall=rainfall, pesticides=pesticides, temperature=temperature,
                    predicted_yield=predicted_yield
                )
                st.success("Advisory Report Generated Successfully!")
                st.markdown("### 📋 Farm Advisory Report")
                st.markdown(report)
                
                # Extension: PDF Export
                try:
                    from utils import create_pdf
                    pdf_bytes = create_pdf(report)
                    st.download_button(
                        label="Download Report as PDF",
                        data=pdf_bytes,
                        file_name=f"Farm_Advisory_Report_{crop}_{country}.pdf",
                        mime="application/pdf"
                    )
                except ImportError:
                    st.download_button(
                        label="Download Report as Text",
                        data=report,
                        file_name=f"Farm_Advisory_Report_{crop}_{country}.txt",
                        mime="text/plain"
                    )
                
            except ImportError:
                st.error("Agent module not found. Please ensure `src/agent.py` exists.")
        except Exception as e:
            st.error(f"Error generating report: {str(e)}")
