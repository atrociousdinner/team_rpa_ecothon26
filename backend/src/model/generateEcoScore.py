import os
import re

import pandas as pd
import requests
from dotenv import load_dotenv

load_dotenv()

PORT = os.getenv("PORT")
API = f"http://localhost:{PORT}/api/get_eco_score"

def tagStringToArray(tagString):
    tags = re.split(r"\s+", tagString.lower().replace(",", " "))
    tagArray = []
    for tag in tags:
        tagArray.append({"name": tag, "value": None})
    return tagArray


def generateEcoScore(tagArray):
    try:
        response = requests.post(API, json={"tags": tagArray})
        return response.json().get("ecoScore", None)
    except Exception as e:
        print(f"Could not generate eco score: {e}")
        return None


dir_path = os.path.dirname(os.path.abspath(__file__))
clean_csv_path = os.path.join(dir_path, "cleaned_data.csv")
score_csv_path = os.path.join(dir_path, "data_with_new_eco_score.csv")

df = pd.read_csv(clean_csv_path, dtype = str)

eco_score = []

for index, row in df.iterrows():
    tagArray = tagStringToArray(row["tags"])
    score = generateEcoScore(tagArray)
    print(f"For tags: {tagArray}\nEcoScore: {score}\n")
    eco_score.append(score)

df["eco_score"] = eco_score
df.to_csv(score_csv_path)
print("CSV file created successfully!")
