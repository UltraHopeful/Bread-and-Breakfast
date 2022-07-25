from google.cloud import language_v1
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('JSON_FILE')
firebase_admin.initialize_app(cred)
db = firestore.client()
client = language_v1.LanguageServiceClient()


def hello_world(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    request_json = request.get_json()
    text_content = request_json["text"]
    type_ = language_v1.Document.Type.PLAIN_TEXT
    language = "en"
    document = {"content": text_content, "type_": type_, "language": language}

    # Available values: NONE, UTF8, UTF16, UTF32
    encoding_type = language_v1.EncodingType.UTF8

    response = client.analyze_sentiment(request={'document': document, 'encoding_type': encoding_type})
    sm_score = response.document_sentiment.score
    sm_magnitude = response.document_sentiment.magnitude

    if sm_score <= -0.25:
        status = 'NEGATIVE'
    elif sm_score <= 0.25:
        status = 'NEUTRAL'
    else:
        status = 'POSITIVE'

    data = {
        "text": text_content,
        "score": sm_score,
        "status": status,
        "magnitude": sm_magnitude
    }

    db.collection('reviewSentiments').add(data)
    return data
