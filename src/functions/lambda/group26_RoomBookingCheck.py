# lambda function for Lex intent of room booking
import json
import datetime
import time
import os
import dateutil.parser
import logging

import requests
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


# --- Helpers that build all of the responses ---

# enter the specific slot detail again
def elicit_slot(session_attributes, intent_name, slots, slot_to_elicit, message):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'ElicitSlot',
            'intentName': intent_name,
            'slots': slots,
            'slotToElicit': slot_to_elicit,
            'message': message
        }
    }

# confirm the whole intent if all slots are filled or some other reason


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

# close the intent for some reason like all slots are filled and the intent fulfilled or failed


def close(session_attributes, fulfillment_state, message):
    print(
        {
            'sessionAttributes': session_attributes,
            'dialogAction': {
                'type': 'Close',
                'fulfillmentState': fulfillment_state,
                'message': message
            }})
    response = {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': fulfillment_state,
            'message': message
        }
    }
    return response

# revert to lex for automatic decision take by itself


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

# buiding the validation result to validate slot again with message


def build_validation_result(isvalid, violated_slot, message_content):
    return {
        'isValid': isvalid,
        'violatedSlot': violated_slot,
        'message': {'contentType': 'PlainText', 'content': message_content}
    }

# util functions

# room type check
def room_type_check(room_type):
    room_types = ['single', 'twin', 'triple', 'quad', 'suite']
    print(room_type.lower() in room_types)
    return room_type.lower() in room_types

# date format validation check
def isDateValid(date):
    try:
        dateutil.parser.parse(date)
        return True
    except ValueError:
        return False

# calculate the stay duration by check in and check out date.
def stay_duration(check_in_date, check_out_date):
    check_in_datetime = dateutil.parser.parse(check_in_date).date()
    check_out_datetime = dateutil.parser.parse(check_out_date).date()
    return abs(check_in_datetime - check_out_datetime).days

# getting the room type id from room tyep
def room_type_id(room_type):
    room_types = [{'single': '1'}, {'twin': '2'}, {
        'triple': '3'}, {'quad': '4'}, {'suite': '5'}]
    room_id = 0
    for room in room_types:
        if room.get(room_type.lower()):
            room_id = room.get(room_type.lower())
            print(f"room_id - {room_id}")

    return room_id

# calculate the total amount of bill
def generate_bill(check_in_date, check_out_date, room_type, no_of_rooms):
    room_types = [{'single': 90}, {'twin': 100}, {
        'triple': 200}, {'quad': 420}, {'suite': 550}]

    no_of_days = stay_duration(check_in_date, check_out_date)

    total_amount = 0
    for room in room_types:
        if room.get(room_type.lower()):
            total_amount = int(no_of_rooms) * no_of_days * \
                room.get(room_type.lower())
            print(total_amount)

    return total_amount

# convert to specific time format to send it to booking api
def epoch_time(date):
    # make epoch time
    try:
        return time.mktime(time.strptime(date, "%Y-%m-%d"))
    except:
        return None

# validates the slots of book room intent
def validate_book_room(slots):
    check_in_date = slots.get("checkInDate", None)
    check_out_date = slots.get("checkOutDate", None)
    room_type = slots.get("typeOfRoom", None)
    no_of_rooms = slots.get("noOfRoom", None)
    print(
        f"validate book room function {check_in_date} {check_out_date} {room_type} {no_of_rooms}")

    if check_in_date:
        if datetime.datetime.strptime(check_in_date, '%Y-%m-%d').date() <= datetime.date.today():
            return build_validation_result(False, 'checkInDate', 'Check-in-date should be after today')
        if not isDateValid(check_in_date):
            return build_validation_result(False, 'checkInDate', 'Your given date is not in proper date format. Please eneter it again.')

    if check_out_date:
        if not isDateValid(check_out_date):
            return build_validation_result(False, 'checkOutDate', 'Your given date is not in proper date format. Please eneter it again.')

    if check_in_date and check_out_date:
        if dateutil.parser.parse(check_in_date) >= dateutil.parser.parse(check_out_date):
            return build_validation_result(False, 'checkOutDate', 'Your check-out-date should be after check-in-date')
        if stay_duration(check_in_date, check_out_date) > 14:
            return build_validation_result(False, 'checkInDate', 'You can only book rooms for maximum 14 days.')

    if room_type is not None:
        if room_type_check(room_type) == False:
            return build_validation_result(
                False,
                'typeOfRoom',
                'Sorry please enter valid room type from below list : Single, Twin, Triple, Quad, Suite')

    if no_of_rooms is not None:
        print("no of rooms check")
        if int(no_of_rooms) > 10 and int(no_of_rooms) < 0:
            return build_validation_result(
                False,
                'noOfRoom',
                'We can allow only maximum 10 rooms per customer.'
            )

    return {'isValid': True}


# setting user credentials
def setUserCred(intent_request):
    print(intent_request['currentIntent']['slots'])
    session_attributes = {
        'userId': intent_request['currentIntent']['slots']['userId'],
    }
    print(session_attributes)
    return close(
        session_attributes,
        'Fulfilled',
        {
            'contentType': 'PlainText',
            'content': 'Your userId stored successfully for further communication.'
        }
    )
    # return delegate(session_attributes, intent_request['currentIntent']['slots'])

# book room intent


def book_room(intent_request):
    print(intent_request)
    slots = intent_request['currentIntent']['slots']
    check_in_date = slots['checkInDate']
    check_out_date = slots['checkOutDate']
    type_of_room = slots['typeOfRoom']
    no_of_room = slots['noOfRoom']

    confirmation_status = intent_request['currentIntent']['confirmationStatus']
    session_attributes = {}

    if intent_request['sessionAttributes'] is not None:
        session_attributes = intent_request['sessionAttributes']
    print(f"session attr - {session_attributes}")

    confirmation_context = session_attributes.get('confirmationContext')

    print(f"confirmation_context {confirmation_context}")
    if(session_attributes.get('userId') != None and session_attributes.get('userId') != 'undefined'):
        if intent_request['invocationSource'] == 'DialogCodeHook':
            validation_result = validate_book_room(
                intent_request['currentIntent']['slots'])
            if not validation_result['isValid']:
                slots = intent_request['currentIntent']['slots']
                slots[validation_result['violatedSlot']] = None

                return elicit_slot(
                    session_attributes,
                    intent_request['currentIntent']['name'],
                    slots,
                    validation_result['violatedSlot'],
                    validation_result['message']
                )

            if confirmation_status == 'Denied':
                # Clear out auto-population flag for subsequent turns.
                # try_ex(lambda: session_attributes.pop('confirmationContext'))
                # try_ex(lambda: session_attributes.pop('currentReservation'))
                if confirmation_context == 'AutoPopulate':
                    return elicit_slot(
                        session_attributes,
                        intent_request['currentIntent']['name'],
                        {
                            'checkInDate': None,
                            'checkOutDate': None,
                            'typeOfRoom': None,
                            'noOfRoom': None
                        },
                        'checkInDate',
                        {
                            'contentType': 'PlainText',
                            'content': 'When you want to check-in?'
                        }
                    )

                return delegate(session_attributes, intent_request['currentIntent']['slots'])

            if check_in_date and check_out_date and type_of_room and no_of_room and confirmation_status == 'None':
                # Generate the estimated bill to send to customer
                print("All slots filled")
                total_amount = generate_bill(
                    check_in_date, check_out_date, type_of_room, no_of_room)
                messageForConfirmation = f"Booking information: \n check in date : {check_in_date},  check out date: {check_out_date}, stay duration: {stay_duration(check_in_date,check_out_date)} days, \n type of room: {type_of_room}, no of rooms: {no_of_room}, total amount: CA$ {total_amount}. Can I go ahead with this?"
                return confirm_intent(
                    session_attributes,
                    intent_request['currentIntent']['name'],
                    intent_request['currentIntent']['slots'],
                    {
                        'contentType': 'PlainText',
                        'content': messageForConfirmation
                    }
                )

            # when all slots are filled and the user said yes to confirm the booking
            if check_in_date and check_out_date and type_of_room and no_of_room and confirmation_status == 'Confirmed':
                book_room_url = 'https://pfqnboa6zi.execute-api.us-east-1.amazonaws.com/dev/api/hotel/bookroom'
                requestBody = {
                    'message': "room booking",
                    'path': 'bookroom',
                    'checkin': str(int(epoch_time(check_in_date))),
                    'checkout': str(int(epoch_time(check_out_date))),
                    'rooms': no_of_room,
                    'roomid': room_type_id(type_of_room),
                    'user': session_attributes['userId']
                }
                try:
                    orderResponse = requests.post(
                        book_room_url, json=requestBody)
                    print(orderResponse.json())
                    responseMsg = orderResponse.json().get('body')
                    return close(
                        session_attributes,
                        'Fulfilled',
                        {
                            'contentType': 'PlainText',
                            'content': responseMsg
                        }
                    )
                except:
                    print("error in room booking")
                    return close(
                        session_attributes,
                        'Failed',
                        {
                            'contentType': 'PlainText',
                            'content': 'Sorry, your this booking is not available'
                        }
                    )

            return delegate(session_attributes, intent_request['currentIntent']['slots'])

    else:
        print("Not login")
        return close(
            session_attributes,
            'Failed',
            {
                'contentType': 'PlainText',
                'content': 'Sorry, you have to login first.'
            }
        )


def dispatch(intent_request):
    """
    Called when the user specifies an intent for this bot.
    """
    print(intent_request)
    logger.debug('dispatch userId={}, intentName={}'.format(
        intent_request['userId'], intent_request['currentIntent']['name']))

    intent_name = intent_request['currentIntent']['name']

    # Dispatch to your bot's intent handlers
    if intent_name == 'Roombooking':
        return book_room(intent_request)
    elif intent_name == 'UserCred':
        return setUserCred(intent_request)

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
