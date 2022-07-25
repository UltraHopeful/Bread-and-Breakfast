import json
from google.cloud import bigquery
from datetime import datetime
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "cred.json"

client = bigquery.Client()

# lib: google-cloud-bigquery
# s3://group26-images


def get_str(time):
    return datetime.utcfromtimestamp(time).strftime('%Y-%m-%d')


def lambda_handler(event, context):
    data = json.loads(event["Records"][0]["body"])
    if "type" in data:
        if data["type"] == "hotel":
            raw1 = {
                "user_id": data['user_id'],
                "booking_id": data['booking_id'],
                "checkin": get_str(int(data['checkin'])),
                "checkout": get_str(int(data['checkout'])),
                "rooms": data["rooms"],
                "roomtype": data["roomtype"],
                "hotel_bill": data["hotel_bill"]
            }
            big_data = [raw1]

            res = client.insert_rows_json(
                table="serverless-group26.group26.hotel", json_rows=big_data)
        elif data["type"] == "kitchen":

            user_id = data["user"]
            data["user_id"] = user_id
            del data["user"]
            del data["type"]
            big_data = [data]

            client.insert_rows_json(
                table="serverless-group26.group26.kitchen", json_rows=big_data)
    return
