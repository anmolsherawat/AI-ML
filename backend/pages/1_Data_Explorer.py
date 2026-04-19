import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src'))
from utils_ui import get_data

st.set_page_config(page_title="Data Explorer", page_icon="📊", layout="wide")
st.title("📊 Data Explorer")

use_uploaded = st.checkbox("Upload your own CSV file")

if use_uploaded:
    uploaded_file = st.file_uploader("Choose a CSV file", type="csv")
    if uploaded_file is not None:
        df = pd.read_csv(uploaded_file)
        if 'Unnamed: 0' in df.columns:
            df.drop(columns=['Unnamed: 0'], inplace=True)
    else:
        st.info("Please upload a file or uncheck the box to use the built-in dataset.")
        st.stop()
else:
    df = get_data()

if df.empty:
    st.error("No data available.")
    st.stop()

st.subheader("Dataset Info")
col1, col2, col3 = st.columns(3)
col1.metric("Rows", len(df))
col2.metric("Columns", len(df.columns))
col3.metric("Missing Values", df.isnull().sum().sum())

st.dataframe(df.describe().round(2))

st.subheader("Visualizations")

st.markdown("**Average Yield by Crop Type**")
avg_by_crop = df.groupby('Item')['hg/ha_yield'].mean().sort_values(ascending=True)
fig1 = px.bar(
    x=avg_by_crop.values, y=avg_by_crop.index,
    orientation='h', labels={'x': 'Avg Yield (hg/ha)', 'y': 'Crop'},
    color=avg_by_crop.values, color_continuous_scale='Greens'
)
fig1.update_layout(height=400, showlegend=False)
st.plotly_chart(fig1, use_container_width=True)

st.markdown("**Yield Distribution by Crop**")
fig2 = px.box(df, x='Item', y='hg/ha_yield', color='Item')
fig2.update_layout(height=400, showlegend=False, xaxis_tickangle=-30)
st.plotly_chart(fig2, use_container_width=True)

st.markdown("**Average Yield Over Time**")
yearly = df.groupby('Year')['hg/ha_yield'].mean().reset_index()
fig3 = px.line(yearly, x='Year', y='hg/ha_yield',
               labels={'hg/ha_yield': 'Avg Yield (hg/ha)'})
fig3.update_traces(line_color='green')
fig3.update_layout(height=350)
st.plotly_chart(fig3, use_container_width=True)

st.markdown("**Feature Correlations**")
numeric = df.select_dtypes(include=[np.number])
corr = numeric.corr()
fig4 = px.imshow(corr, text_auto='.2f', color_continuous_scale='RdYlGn', aspect='auto')
fig4.update_layout(height=450)
st.plotly_chart(fig4, use_container_width=True)

st.markdown("**Top 15 Countries by Average Yield**")
top = df.groupby('Area')['hg/ha_yield'].mean().sort_values(ascending=False).head(15)
fig5 = px.bar(x=top.index, y=top.values,
              labels={'x': 'Country', 'y': 'Avg Yield (hg/ha)'},
              color=top.values, color_continuous_scale='YlGn')
fig5.update_layout(height=400, showlegend=False, xaxis_tickangle=-45)
st.plotly_chart(fig5, use_container_width=True)
