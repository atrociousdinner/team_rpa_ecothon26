import json
import sys
import math
import pandas as pd

def sanitize(data):
    if isinstance(data, dict):
        return {k: sanitize(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize(v) for v in data]
    elif isinstance(data, float) and (math.isnan(v := data) or math.isinf(v)):
        return None
    return data

def barcode_search(barcode, csv_file):
    try:
        df = pd.read_csv(csv_file)
        result = df[df["code"] == barcode]
        if result.empty:
            print(json.dumps({"found": False, "message": "Product not found"}))
        else:
            product = result.iloc[0].to_dict()
            cleaned_product = sanitize(product)
            print(json.dumps({"found": True, "product": cleaned_product}))
    except Exception as e:
        print(json.dumps({"Error: ": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Usage: python search_product.py <barcode> <csv_file>"}))
    else:
        barcode = sys.argv[1]
        csv_file = sys.argv[2]
        barcode_search(barcode, csv_file)
