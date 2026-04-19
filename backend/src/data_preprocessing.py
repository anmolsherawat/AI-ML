import pandas as pd
import numpy as np
import os

def load_data():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    data_path = os.path.join(base_dir, 'data', 'yield_df.csv')
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
        if 'Unnamed: 0' in df.columns:
            df.drop(columns=['Unnamed: 0'], inplace=True)
        return df
    return pd.DataFrame()

def preprocess(df):
    # This is a placeholder for preprocessing
    return df
