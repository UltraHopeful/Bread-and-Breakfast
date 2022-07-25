import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('group26_users')
    response = table.scan()
    return response['Items']
    