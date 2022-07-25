# lambda function for Lex intent of room booking
import json
import datetime
import time
import os
import dateutil.parser
import logging

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

# get navigation link intent
def get_nav_link(intent_request):
    print(intent_request)
    slots = intent_request['currentIntent']['slots']
    pageName = slots['page']

    confirmation_status = intent_request['currentIntent']['confirmationStatus']
    session_attributes = {}

    if intent_request['sessionAttributes'] is not None:
        session_attributes = intent_request['sessionAttributes']
    print(f"session attr - {session_attributes}")

    confirmation_context = session_attributes.get('confirmationContext')

    print(f"confirmation_context {confirmation_context}")
    if intent_request['invocationSource'] == 'FulfillmentCodeHook':
        print("If condition")
        print(pageName)
        if pageName == "roombooking":
            print(pageName)
            response = {
                'sessionAttributes': session_attributes,
                'dialogAction': {
                    'type': 'Close',
                    'fulfillmentState': "Fulfilled",
                    'message': {
                        'contentType': 'PlainText',
                        'content': "To go room booking just click on left-top side 'room booking' in navigation bar"
                    }
                }
            }
            print(response)
            return response 
        
        elif pageName == "mealorder":
            print(pageName)
            response = {
                'sessionAttributes': session_attributes,
                'dialogAction': {
                    'type': 'Close',
                    'fulfillmentState': "Fulfilled",
                    'message': {
                        'contentType': 'PlainText',
                        'content': "To go meal order just click on left-top side 'Order Meal' in navigation bar"
                    }
                }
            }
            return response 
        
        elif pageName == "tourservice":
            response = {
                'sessionAttributes': session_attributes,
                'dialogAction': {
                    'type': 'Close',
                    'fulfillmentState': "Fulfilled",
                    'message': {
                        'contentType': 'PlainText',
                        'content': "To go tour service just click on left-top side 'Tour Service' in navigation bar"
                    } 
                }
            }
            return response 

        elif pageName == "feedback":
            response = {
                'sessionAttributes': session_attributes,
                'dialogAction': {
                    'type': 'Close',
                    'fulfillmentState': "Fulfilled",
                    'message': {
                        'contentType': 'PlainText',
                        'content': "To give feedback just click on righ-top side avatar and click on 'Feedback' in navigation bar"
                    }
                }
            }
            return response 
        
        else:
            response = {
                'sessionAttributes': session_attributes,
                'dialogAction': {
                    'type': 'Close',
                    'fulfillmentState': "Failed",
                    'message': {
                        'contentType': 'PlainText',
                        'content': "Sorry no page available for your request."
                    }
                }
            }
            return response 

def dispatch(intent_request):
    """
    Called when the user specifies an intent for this bot.
    """
    print(intent_request)
    logger.debug('dispatch userId={}, intentName={}'.format(
        intent_request['userId'], intent_request['currentIntent']['name']))

    intent_name = intent_request['currentIntent']['name']

    # Dispatch to your bot's intent handlers
    if intent_name == 'NavigatorLink':
        return get_nav_link(intent_request)

    raise Exception('Intent with name ' + intent_name + ' not supported')


# --- Main handler ---


def lambda_handler(event, context):
    """
    Route the incoming request based on intent.
    The JSON body of the request is provided in the event slot.
    """
    # By default, treat the user request as coming from the America/New_York time zone.
    os.environ['TZ'] = 'America/Halifax'
    time.tzset()
    logger.debug('event.bot.name={}'.format(event['bot']['name']))

    return dispatch(event)
