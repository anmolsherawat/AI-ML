import streamlit as st
import pandas as pd
import plotly.express as px
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src'))
from utils_ui import get_model_artifacts

st.set_page_config(page_title="Model Performance", page_icon="📈", layout="wide")
st.title("📈 Model Performance")

artifacts = get_model_artifacts()
if artifacts[0] is None:
    st.error("No model results found. Please train models first.")
    st.stop()

model, model_name, encoders, scaler, features, results = artifacts

if not results:
    st.warning("Model results JSON not found. Run the training script to generate full evaluation metrics.")
    st.stop()

st.success(f"Best Regression Model: **{model_name}** with R² = {results[model_name]['metrics']['R2']:.4f}")

st.subheader("Regression Models Comparison")

reg_rows = []
for name, r in results.items():
    if r.get('type') == 'regression':
        m = r['metrics']
        reg_rows.append({
            'Model': name,
            'MAE': m['MAE'],
            'RMSE': m['RMSE'],
            'R² Score': m['R2'],
        })
        
if reg_rows:
    reg_df = pd.DataFrame(reg_rows)
    st.dataframe(reg_df, hide_index=True)

    fig1 = px.bar(reg_df, x='Model', y='R² Score', color='R² Score',
                  color_continuous_scale='Greens', title="R² Score Comparison (Higher is better)")
    fig1.update_traces(texttemplate='%{y:.4f}', textposition='outside')
    fig1.update_layout(height=400, showlegend=False)
    st.plotly_chart(fig1, use_container_width=True)

    col1, col2 = st.columns(2)
    with col1:
        fig2 = px.bar(reg_df, x='Model', y='MAE', color='MAE',
                       color_continuous_scale='Reds', title="MAE Comparison (Lower is better)")
        fig2.update_traces(texttemplate='%{y:.2f}', textposition='outside')
        fig2.update_layout(height=350, showlegend=False)
        st.plotly_chart(fig2, use_container_width=True)
    with col2:
        fig3 = px.bar(reg_df, x='Model', y='RMSE', color='RMSE',
                       color_continuous_scale='Oranges', title="RMSE Comparison (Lower is better)")
        fig3.update_traces(texttemplate='%{y:.2f}', textposition='outside')
        fig3.update_layout(height=350, showlegend=False)
        st.plotly_chart(fig3, use_container_width=True)

st.subheader("Feature Importance (Best Regression Model)")
if results[model_name].get('feature_importance'):
    imp = results[model_name]['feature_importance']
    imp_sorted = dict(sorted(imp.items(), key=lambda x: x[1], reverse=True))

    fig4 = px.bar(
        x=list(imp_sorted.values()), y=list(imp_sorted.keys()),
        orientation='h', labels={'x': 'Importance', 'y': 'Feature'},
        color=list(imp_sorted.values()), color_continuous_scale='Greens'
    )
    fig4.update_layout(height=400, showlegend=False)
    st.plotly_chart(fig4, use_container_width=True)

with st.expander("What do these metrics mean?"):
    st.markdown("""
    **Regression Metrics:**
    - **MAE (Mean Absolute Error):** Average absolute difference between predicted and actual values. Lower = better.
    - **RMSE (Root Mean Squared Error):** Similar to MAE but penalizes large errors more. Lower = better.
    - **R² Score:** How much variance the model explains (0 to 1). Closer to 1 = better.
    """)
