import boto3
from datetime import datetime
import json
import http.client


TABLE_USER_FEEDBACK = "group26_user_reviews"


def validate_review(event):
    if not "booking_id" in event:
        return True, {
            'statusCode': 400,
            'body': 'booking_id is required'
        }
    if not "user" in event:
        return True, {
            'statusCode': 400,
            'body': 'user is required'
        }
    if not "review" in event:
        return True, {
            'statusCode': 400,
            'body': 'review is required'
        }
    return False, None


def save_review(event):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(TABLE_USER_FEEDBACK)
    data = {}
    data["user_id"] = event["user"]
    data["review_id"] = ''.join(
        str(datetime.now()).replace(" ", "-").split("."))
    data["booking_id"] = event["booking_id"]
    data["review"] = event["review"]
    res1 = table.put_item(Item=data)
    conn = http.client.HTTPSConnection(
        "us-central1-vinay-serverless.cloudfunctions.net")
    payload = json.dumps(data)
    headers = {
        'Content-Type': 'application/json'
    }
    conn.request("POST", "/getSentiment", payload, headers)
    res = conn.getresponse()
    data = res.read()
    print(data.decode("utf-8"))

    return {
        'statusCode': 200,
        'body': 'Review submitted!'
    }


def lambda_handler(event, context):

    if not "path" in event:
        return {
            'statusCode': 400,
            'body': 'path is required'
        }

    if event["path"] == "review":
        flag, data = validate_review(event)
        if flag:
            return data
        return save_review(event)

    else:
        {
            'statusCode': 400,
            'body': 'path is invalid'
        }
