import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('JSON_FILE')
firebase_admin.initialize_app(cred)
db = firestore.client()


def hello_world(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    data = db.collection('reviewSentiments').get()
    data = [i.to_dict() for i in data]
    data = {"results": data}
    return data

