# lambda function for Lex intent of room booking
import json
import datetime
import time
import os
import dateutil.parser
import logging

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


def confirm_intent(session_attributes, intent_name, slots, message):
    print({
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'ConfirmIntent',
            'intentName': intent_name,
            'slots': slots,
            'message': message
        }})
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'ConfirmIntent',
            'intentName': intent_name,
            'slots': slots,
            'message': message
        }
    }

def delegate(session_attributes, slots):
    print({
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Delegate',
            'slots': slots
        }})
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Delegate',
            'slots': slots
        }
    }

def generate_bill(mealId,noOfMeal):
    meals = [{"EGG SANDWICH" : 20},{"PEANUT BUTTER BREAKFAST COOKIES" : 28},{"AVOCADO, KALE AND SPINACH SMOOTHIE" : 15},{"LEMONY STRAWBERRY OAT SOAK WITH KIWI MINT" : 18},{"HEALTHY WHOLE-GRAIN AND SEED PANCAKES" : 25},{"AVOCADO AND EGG BREAKFAST TACOS" : 30},{"PROTEIN-PACKED BREAKFAST BURRITOS" : 22},{"SMASHED AVOCADO TOAST WITH FRIED EGG & SALSA" : 22},{"APPLE-CINNAMON OATS" : 12},{"MANGO-PINEAPPLE YOGURT BOWL" : 15}]
    print(mealId,noOfMeal)
    print(type(mealId),type(noOfMeal))
    total_amount = 0
    for meal in meals:
        if meal.get(mealId):
            print(meal.get(mealId))
            total_amount = meal.get(mealId) * int(noOfMeal)
    
    return total_amount

def get_tours(intent_request):
    if intent_request['invocationSource'] == 'FulfillmentCodeHook':
        responseMsg = f"Here is your tours : Tour Id: 34924,	Hotel: BW, Destination:	Argyle,	Days: 3,	Price: 60.39 CAD || Tour Id: 40187,	Hotel: A, Destination:	Halifax,	Days: 1,	Price: 313.02 CAD || Tour Id: 35597,	Hotel: BD, Destination:	Cape Breten, Days: 2,	Price: 242.88 CAD || Tour Id: 42215,	Hotel: CB, Destination:	Windsor,	Days: 2,	Price: 165.99 CAD || Tour Id: 122449,	Hotel: K, Destination:	Sydney,	Days: 2,	Price: 263.41 CAD"
        response = {
            'dialogAction': {
                'type': 'Close',
                'fulfillmentState': "Fulfilled",
                'message': {
                    'contentType': 'PlainText',
                    'content': responseMsg
                }
            }
        }
        return response

# get meal bill
def get_meal_bill(intent_request):
    print(intent_request)
    slots = intent_request['currentIntent']['slots']
    mealId = slots['mealId']
    noOfMeal = slots['noOfMeal']
    bookingId = slots['bookingId']

    confirmation_status = intent_request['currentIntent']['confirmationStatus']
    session_attributes = {}

    if intent_request['sessionAttributes'] is not None:
        session_attributes = intent_request['sessionAttributes']
    print(f"session attr - {session_attributes}")

    confirmation_context = session_attributes.get('confirmationContext')

    print(f"confirmation_context {confirmation_context}")
    if intent_request['invocationSource'] == 'DialogCodeHook':
        if mealId and noOfMeal and confirmation_status == 'None':
            total_amount = generate_bill(mealId,noOfMeal)

            responseMsg = f"Are you sure to go ahead with below order : meal - {mealId}, no of meal - {noOfMeal}, bill - {total_amount}"
            response = {
                    'sessionAttributes': session_attributes,
                    'dialogAction': {
                        'type': 'ConfirmIntent',
                        'intentName': 'MealOrder',
                        'slots': slots,
                        'message': {
                            'contentType': 'PlainText',
                            'content': responseMsg
                        } 
                    }
                }

            print(response)
            return response 
        
        return delegate(session_attributes, intent_request['currentIntent']['slots'])
    
    if intent_request['invocationSource'] == 'FulfillmentCodeHook':
        print(mealId,noOfMeal,bookingId)
        
        if confirmation_status == "Confirmed":
            response = {
                'sessionAttributes': session_attributes,
                'dialogAction': {
                    'type': 'Close',
                    'fulfillmentState': "Fulfilled",
                    'message': {
                        'contentType': 'PlainText',
                        'content': 'Meal ordered successfully'
                    }
                }
            }

            print(response)
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
    if intent_name == 'MealOrder':
        return get_meal_bill(intent_request)
    elif intent_name == "TourService":
        return get_tours(intent_request)

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
