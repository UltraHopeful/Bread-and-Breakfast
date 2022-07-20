import json
import boto3
from datetime import datetime
from datetime import timedelta
import time
import uuid
from boto3.dynamodb.types import TypeDeserializer
import urllib3


ROOMS_INVENTORY_TABLE = 'group26_rooms_inventory'
BOOKING_TABLE = 'group26_user_room_booking'
http = urllib3.PoolManager()


def validate_data(event, book=False):
    if not "checkin" in event:
        return True, {
            'statusCode': 400,
            'body': "Check In is Required Field"
        }
    if not "checkout" in event:
        return True, {
            'statusCode': 400,
            'body': "Check Out is Required Field"
        }
    if not "rooms" in event:
        return True, {
            'statusCode': 400,
            'body': "Rooms is Required Field"
        }
    if book and not "roomid" in event:
        return True, {
            'statusCode': 400,
            'body': "Room id is Required Field"
        }
    if book and not "user" in event:
        return True, {
            'statusCode': 400,
            'body': "User is Required Field"
        }
    return False, None


def check_availability(event):
    dynamodb_client = boto3.client('dynamodb', region_name="us-east-1")
    res_rooms = []
    room_id = ["1", "2", "3", "4", "5"]
    for id in room_id:
        response = dynamodb_client.query(
            TableName=ROOMS_INVENTORY_TABLE,
            KeyConditionExpression='roomid = :roomid AND reserve_date BETWEEN :datecheckin AND :datecheckout',
            ExpressionAttributeValues={
                ':roomid': {'N': id},
                ':datecheckin': {'N': event["checkin"]},
                ':datecheckout': {'N': event["checkout"]}
            })
        res = response["Items"]
        flag = True

        for item in res:
            if int(item["availibility"]["N"]) < int(event["rooms"]):
                flag = False
                break
        if flag:
            res_rooms.append(id)
    return res_rooms


def batch_write(table=ROOMS_INVENTORY_TABLE, table_data=[]):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table)
    with table.batch_writer() as writer:
        for item in table_data:
            writer.put_item(Item=item)

# https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/python/example_code/dynamodb/batching/dynamo_batching.py


def get_items():
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('group26_rooms')
    response = table.scan()
    return response['Items']


def set_availibility(startdate='07/16/2022'):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(ROOMS_INVENTORY_TABLE)

    room_id = [1, 2, 3, 4, 5]
    table_data = []
    for room in room_id:
        datetime_object = datetime.strptime(startdate, '%m/%d/%Y')
        part_key = room
        availability = 25

        for i in range(45):
            datetime_object = datetime_object+timedelta(days=1)
            unixtime = int(time.mktime(datetime_object.timetuple()))
            comp_key = unixtime

            dataPoint = {'roomid': part_key,
                         'reserve_date': comp_key, 'availibility': availability}
            table_data.append(dataPoint)

    batch_write(ROOMS_INVENTORY_TABLE, table_data)


def book_room(event):
    dynamodb_client = boto3.client('dynamodb', region_name='us-east-1')
    response = dynamodb_client.query(
        TableName=ROOMS_INVENTORY_TABLE,
        KeyConditionExpression='roomid = :roomid AND reserve_date BETWEEN :datecheckin AND :datecheckout',
        ExpressionAttributeValues={
            ':roomid': {'N': event['roomid']},
            ':datecheckin': {'N': event['checkin']},
            ':datecheckout': {'N': event['checkout']}
        })
    res = response['Items']
    deserializer = TypeDeserializer()
    python_array = []
    flag = True
    rooms = int(event['rooms'])
    for item in res:
        python_data = {k: deserializer.deserialize(
            value) for k, value in item.items()}
        if python_data['availibility'] < rooms:
            flag = False
            break
        else:
            python_data['availibility'] -= rooms
            python_array.append(python_data)

    if flag:
        batch_write(ROOMS_INVENTORY_TABLE, python_array)
        booking_id = ''.join(
            str(datetime.now()).replace(" ", "-").split("."))
        booking_doc = {'user_id': {'S': event['user']},
                       'booking_id':
                       {'S': booking_id}, 'checkin': {'S': event['checkin']}, 'checkout': {'S': event['checkout']}, 'rooms': {'S': event['rooms']}, 'roomtype': {'S': event['roomid']}}
        response = dynamodb_client.put_item(
            TableName=BOOKING_TABLE,
            Item=booking_doc
        )

        res = http.request("POST", "https://pfqnboa6zi.execute-api.us-east-1.amazonaws.com/dev/api/notification",
                           body=json.dumps({"message": "Successfully Booked Rooms with booking id: "+str(booking_id), "user": event['user']}))

        return {
            'statusCode': 200,
            'body': f'Successfully Booked Rooms. booking id: {booking_id}!'}

    else:
        return {
            'statusCode': 400,
            'body': 'Error while Booking'
        }


def get_bookings(event):
    dynamodb_client = boto3.client('dynamodb', region_name='us-east-1')
    response = dynamodb_client.query(
        TableName=BOOKING_TABLE,
        KeyConditionExpression='user_id = :userid',
        ExpressionAttributeValues={
            ':userid': {'S': event['user']},
        })
    res = response['Items']
    deserializer = TypeDeserializer()
    python_array = []
    flag = True
    for item in res:
        python_data = {k: deserializer.deserialize(
            value) for k, value in item.items()}
        python_array.append(python_data)

    if python_array:
        return {
            'statusCode': 200,
            'body': python_array
        }
    else:
        {
            'statusCode': 400,
            'body': 'User/booking is not exist'
        }


def lambda_handler(event, context):

    if not "path" in event:
        return {
            'statusCode': 400,
            'body': json.dumps("Path attribute is required")
        }

    if event["path"] == "getrooms":
        data = get_items()
        return {
            'statusCode': 200,
            'body': json.dumps(data)}

    elif event["path"] == "check-availability":
        flag, data = validate_data(event)
        if flag:
            return data
        res_data = check_availability(event)

        return {
            'statusCode': 200,
            'body': json.dumps(res_data)}

    elif event["path"] == "bookroom":
        flag, data = validate_data(event, book=True)
        if flag:
            return data
        return book_room(event)

    elif event["path"] == "getbookings":
        if not "user" in event:
            return {
                'statusCode': 400,
                'body': 'User is required field'
            }
        return get_bookings(event)
    else:
        return {
            'statusCode': 400,
            'body': json.dumps("Invalid path attribute")
        }
