import pandas as pd
import os

import psycopg2 as ps

def get_products():
    conn = ps.connect(
        host='localhost',
        database='postgres',
        user='rochak',
        password='postgres123'

    )
    query = 'select * from product'
    df = pd.read_sql(query,conn)

def get_sample_products():

    BASE_DIR = os.path.dirname(__file__)

    csv_path = os.path.join(BASE_DIR, "../model/cleaned_data.csv")
    df = pd.read_csv(csv_path)

    sample_df = df.dropna().sample(20)
    json_data = sample_df.to_json(orient='records')
    return json_data

if __name__ == '__main__':
    print(get_sample_products())
