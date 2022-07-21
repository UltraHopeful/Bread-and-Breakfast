import boto3
import json
from datetime import datetime

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('group26_users')
    
    user_id = event.get("userId")
    print(user_id)
    print(event)
    update_result=""
    user = table.get_item(Key={'user_id': user_id})
    if "Item" in user:
        item = user["Item"]
        item["timestamp"] = str(datetime.now())
        res1 = table.put_item(Item=item)
        update_result = table.get_item(Key={'user_id': user_id})
    else:
        update_result = "user not exist"
    return {
        'statusCode': 200,
        'body':event
    }
    

# lambda_handler(None)