import sys
import re
import json
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS
from sklearn.metrics.pairwise import cosine_similarity

def clean_tags(raw_tags: str) -> str:
    clean = re.sub(r'[^a-zA-Z0-9\s]', ' ', raw_tags)
    clean = clean.lower()
    clean = re.sub(r'\s+', ' ', clean).strip()
    tokens = [t for t in clean.split() if t not in ENGLISH_STOP_WORDS]
    return " ".join(tokens)

def cosineSimilarity(inputTags, csvPath):
    try:
        cleanedInputTags = clean_tags(inputTags)
        df = pd.read_csv(csvPath)

        df["product_tags"] = df["product_tags"].astype(str)
        df["clean_tags"] = df["product_tags"].apply(clean_tags)

        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(df["clean_tags"])
        query_vector = vectorizer.transform([cleanedInputTags])

        cos_sim = cosine_similarity(query_vector, tfidf_matrix).flatten()
        top_indices = cos_sim.argsort()[-40:][::-1]
        sample_indices = np.random.choice(top_indices, size=10, replace=False) 
        
        df = df.rename(columns={"clean_tags": "tags"})
        return df.iloc[sample_indices][["code","product_name", "tags", "brands", "image_url","eco_score"]].to_dict(orient="records")

    except Exception as e:
        print(json.dumps({"error": str(e), "recommendations": []}))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) > 2:
        tags = sys.argv[1]
        csvPath = sys.argv[2]
       
        products = cosineSimilarity(tags, csvPath)

        for product in products:
            for k, v in product.items():
                if isinstance(v, float) and pd.isna(v):
                    product[k] = None

        print(json.dumps({ "recommendations": products }))

    else:
        print(json.dumps({ "error": "More arguments expected", "recommendations": [] }))
