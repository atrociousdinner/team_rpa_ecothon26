import sys
import json
import csv
import os

def insert_product(product, csv_file):
    barcode = product.get("code")
    if not barcode:
        print(json.dumps({"error": "Missing barcode"}))
        return

    fieldnames = ["serial_no", "code", "product_name", "brands", "image_url", "product_tags","other_tags", "eco_score"]

    # Check if CSV exists
    file_exists = os.path.exists(csv_file)

    # Check for duplicates and count existing rows
    serial_no = 1
    if file_exists:
        with open(csv_file, mode='r', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for idx, row in enumerate(reader, start=1):
                if row.get("code") == barcode:
                    print(json.dumps({"message": "Product already exists", "status": 0}))
                    return
                serial_no = idx

    # Add serial_no to the product data
    product_with_serial = {"serial_no": serial_no, **product}

    # Append new product
    with open(csv_file, mode='a', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writerow(product_with_serial)

    print(json.dumps({"message": "Product inserted successfully", "status": 1}))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Usage: python script.py <product_json> <csv_path>"}))
    else:
        try:
            product_json = sys.argv[1]
            csv_path = sys.argv[2]
            product = json.loads(product_json)
            insert_product(product, csv_path)
        except Exception as e:
            print(json.dumps({"error": str(e)}))
