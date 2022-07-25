import boto3
import json
from datetime import datetime


def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('group26_users')

    user_id = event.get("userId")
    login_type = event.get("event_type")

    update_result = ""
    user = table.get_item(Key={'user_id': user_id})
    if "Item" in user:
        item = user["Item"]
        item["timestamp"] = str(datetime.now())
        if login_type == "login":
            item["login"] = True
        elif login_type == "logout":
            item["login"] = False

        res1 = table.put_item(Item=item)

    return {
        'statusCode': 200,
        'body': event
    }
