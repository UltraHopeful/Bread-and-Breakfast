import random
import string
import json
from google.cloud import firestore

def hello_http(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """

    res = {}
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return (res, 204, headers)
       
    
    content_type = request.headers.get('Content-Type')    
    if (content_type == 'application/json'):
        jsonBody = request.get_json()
        print(jsonBody)
    else:
        return 'Content-Type not supported! jhkhkjh'
    key = 0
    db = firestore.Client()
    users_ref = db.collection(u'users')
    for doc in users_ref.stream():
        if doc.id == jsonBody['user_id']:
            key = int(doc.to_dict().get('cipher_key'))
            print("Key fetched from db", key)
    #check the above function
    cipher_given = jsonBody['cipher_text']
    normal_text_given = jsonBody['normal_text']
    cipher_cal = encrypt(normal_text_given, key)
    if cipher_given != cipher_cal:
        res["status"] = "failure"
    else:
        res['status']='success'
    headers = {
        "Access-Control-Allow-Origin":"*",
        "content-type":"application/json"
    }
    return (res,200, headers)

def encrypt(text,s):
    result = ""
    # transverse the plain text
    for i in range(len(text)):
        char = text[i]
    # Encrypt uppercase characters in plain text
        if (char.isupper()):
            result = result + chr((ord(char) + s-65) % 26 + 65)
    return result