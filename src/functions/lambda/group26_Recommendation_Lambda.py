import boto3
import json
import urllib3

CAMP_ARN = "arn:aws:personalize:us-east-1:732139082944:campaign/camp-2"
client_s3 = boto3.client("s3")
client = boto3.client('personalize-runtime', region_name='us-east-1')
http = urllib3.PoolManager()


def get_recommendation(event, item_id):
    response = client.get_recommendations(campaignArn=CAMP_ARN, itemId=item_id)

    response_list = [j['itemId'] for j in response['itemList']]
    bucket_name = 'serverless-bucket-project-26'
    key = 'tours.csv'
    file_obj = client_s3.get_object(Bucket=bucket_name, Key=key)
    file_text = file_obj['Body'].read().decode()
    text_list = file_text.split("\n")
    text_list = text_list[1:]
    tour_list = []
    for i in text_list:
        data = i.split(",")
        try:
            tour_list.append({
                "Id": data[0],
                "Hotel": data[1],
                "Destination": data[2],
                "Days": data[3],
                "Price": data[4].replace("\r", "")
            })
        except:
            pass
    recommendation_list = []
    for tour in tour_list:
        if tour['Id'] in response_list:
            recommendation_list.append(tour)

    i = 0
    for r in recommendation_list:
        if i <= 4:
            noti = "Tour package : " + str(r['Hotel']) + " at " + str(r['Destination']) + " for " + str(r['Price'])
            notification = {
                "data": noti
            }
            print("1: " + noti)
            print(json.dumps(noti))
            res = http.request("POST", "https://pfqnboa6zi.execute-api.us-east-1.amazonaws.com/dev/api/notification",
                               body=json.dumps(notification))
            print("published to notifications : " + str(res.data))
            i = i + 1
    return recommendation_list[1:6]


def lambda_handler(event, context):
    # data = event["body"]

    # print("event : "+json.dumps(event["item_id"]))
    item_id = "1"
    res = get_recommendation(event, item_id)
    print(res)
    return {
        'statusCode': 200,
        'body': res}
