import streamlit as st
import pandas as pd
import plotly.express as px
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src'))
from utils_ui import get_data, get_model_artifacts
from predict import predict_yield

st.set_page_config(page_title="Predict Yield", page_icon="🔮", layout="wide")
st.title("🔮 Predict Crop Yield")

artifacts = get_model_artifacts()
if artifacts[0] is None:
    st.error("Model not found! Please train the model first by running:")
    st.code("python src/model_training.py")
    st.stop()

model, model_name, encoders, scaler, features, results = artifacts
df = get_data()

if model_name in results and 'metrics' in results[model_name]:
    st.info(f"Using best model: **{model_name}** (R² = {results[model_name]['metrics']['R2']:.4f})")
else:
    st.info(f"Using model: **{model_name}**")

st.subheader("Enter Farm Details")

col1, col2 = st.columns(2)

with col1:
    crop = st.selectbox("Crop Type", sorted(encoders['Item'].classes_))
    country = st.selectbox("Country", sorted(encoders['Area'].classes_))
    year = st.slider("Year", 1960, 2030, 2024)

with col2:
    if not df.empty:
        rain_val = round(float(df['average_rain_fall_mm_per_year'].median()), 1)
        pest_val = round(float(df['pesticides_tonnes'].median()), 1)
        temp_val = round(float(df['avg_temp'].median()), 1)
    else:
        rain_val, pest_val, temp_val = 1000.0, 100.0, 20.0
        
    rainfall = st.number_input("Avg Rainfall (mm/year)", min_value=0.0, max_value=5000.0, value=rain_val)
    pesticides = st.number_input("Pesticides (tonnes)", min_value=0.0, max_value=500000.0, value=pest_val)
    temperature = st.number_input("Avg Temperature (°C)", min_value=-10.0, max_value=50.0, value=temp_val)

if st.button("Predict Yield", type="primary"):
    try:
        result = predict_yield(
            area=country, item=crop, year=year,
            rainfall=rainfall, pesticides=pesticides, avg_temp=temperature,
            model=model, encoders=encoders, scaler=scaler, features=features
        )

        st.success(f"Predicted Yield for **{crop}** in **{country}** ({year})")

        col1, col2 = st.columns(2)
        col1.metric("Yield (hg/ha)", f"{result['yield_hg_ha']:,.0f}")
        col2.metric("Yield (tonnes/ha)", f"{result['yield_tonnes_ha']:.2f}")

        if result.get('feature_importance'):
            st.subheader("Feature Importance")
            imp = result['feature_importance']
            imp_sorted = dict(sorted(imp.items(), key=lambda x: x[1], reverse=True))

            fig = px.bar(
                x=list(imp_sorted.values()),
                y=list(imp_sorted.keys()),
                orientation='h',
                labels={'x': 'Importance', 'y': 'Feature'},
                color=list(imp_sorted.values()),
                color_continuous_scale='Greens'
            )
            fig.update_layout(height=300, showlegend=False)
            st.plotly_chart(fig, use_container_width=True)

        with st.expander("View Input Summary"):
            st.table(pd.DataFrame({
                'Parameter': ['Crop', 'Country', 'Year', 'Rainfall (mm)', 'Pesticides (tonnes)', 'Temperature (°C)'],
                'Value': [crop, country, year, rainfall, pesticides, temperature]
            }))

    except Exception as e:
        st.error(f"Error: {str(e)}")
