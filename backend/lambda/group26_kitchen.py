import boto3

import uuid
from boto3.dynamodb.types import TypeDeserializer
import urllib3
import json

prices = {'1': 20, '2': 28, '3': 15, '4': 18, '5': 25,
          '6': 30, '7': 22, '8': 22, '9': 12, '10': 15}


def calculate_price(meals):
    result = 0
    for meal in meals:
        meal_price = prices[meal["meal_id"]]
        result += (meal_price*int(meal.get("meal_value")))
    return result


def validate_data(event):
    if not "meals" in event:
        return True, {
            'statusCode': 400,
            'body': "meals is Required Field"
        }
    if not "booking_id" in event:
        return True, {
            'statusCode': 400,
            'body': "booking_id is Required Field"
        }

    if not "user" in event:
        return True, {
            'statusCode': 400,
            'body': "User is Required Field"
        }
    return False, None


def get_meals():
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('group26_kitchen')
    response = table.scan()
    data = response['Items']
    return data


def sqs_push(data):
    client = boto3.client('sqs')
    client.send_message(
        QueueUrl="https://sqs.us-east-1.amazonaws.com/182962509948/group26_bigquery",
        MessageBody=json.dumps(data)
    )


def order_meal(event):
    try:
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('group26_kitchen_orders')

        id = str(uuid.uuid4())
        price = str(calculate_price(event["meals"]))
        booking_doc = {
            'order_id': id,
            'meals': event["meals"],
            'user': event['user'],
            'booking_id': event['booking_id'],
            'meal_price': price
        }
        response = table.put_item(Item=booking_doc)
        booking_doc["type"] = "kitchen"
        sqs_push(booking_doc)
        http = urllib3.PoolManager()
        pubsub_data = {'message': "meal order",
                       'user_id': event["user"], 'booking_id': event['booking_id'], 'meal_price': price}
        res = http.request(
            "POST", "https://pfqnboa6zi.execute-api.us-east-1.amazonaws.com/dev/api/pubsub", body=json.dumps(pubsub_data))

        return {
            'statusCode': 200,
            'body': f'Processing the order id: {id}!'}
    except Exception as e:
        print(e)
        return True, {
            'statusCode': 400,
            'body': "error while ordering meals"

        }


def get_meals_by_booking(event):
    try:
        dynamodb_client = boto3.client('dynamodb', region_name='us-east-1')
        response = dynamodb_client.query(
            TableName='group26_kitchen_orders',
            KeyConditionExpression='order_id = :order_id',
            ExpressionAttributeValues={
                ':order_id': {'S': event['order_id']}
            })
        res = response['Items']

        deserializer = TypeDeserializer()

        if len(res) == 0:
            return True, {
                'statusCode': 400,
                'body': "No meals found for given order_id"
            }
        python_array = []
        for item in res:
            python_data = {k: deserializer.deserialize(
                value) for k, value in item.items()}
            python_array.append(python_data)
        return False, python_array
    except Exception as e:
        return True, {
            'statusCode': 400,
            'body': "error while processing request check order_id"
        }


def lambda_handler(event, context):

    if not "path" in event:
        return {
            'statusCode': 400,
            'body': "path attribute is required"
        }

    if event["path"] == "meals":
        data = get_meals()
        return {
            'statusCode': 200,
            'body': data}

    elif event["path"] == "getmeals":
        if not "order_id" in event:
            return {
                'statusCode': 400,
                'body': "order_id attribute is required"
            }

        flag, res_data = get_meals_by_booking(event)
        if flag:
            return res_data
        return {
            'statusCode': 200,
            'body': res_data}

    elif event["path"] == "mealorder":
        flag, data = validate_data(event)
        if flag:
            return data
        return order_meal(event)
    else:
        return {
            'statusCode': 400,
            'body': "Invalid path attribute"
        }
