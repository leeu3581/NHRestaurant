import json
import smtplib

def lambda_handler(event, context):
    # TODO implement
    
    email = event['currentIntent']['slots']['Email']
    name = event['currentIntent']['slots']['Name']
    date = event['currentIntent']['slots']['Date']
    number_of_guests = event['currentIntent']['slots']['Guests']
    
    
    
    try:
        returnText  = "Great " + name + ". Your table for " + number_of_guests + " had been booked for " + date +". A confirmation email is on the way."
    except:
        returnText = "I'm really sorry " + name + ". Looks like we're fully booked during this time. Please try again."

    message = {
        "dialogAction" : {
            "type" : "Close",
            "fulfillmentState" : "Fulfilled",
            "message" : {
                "contentType" : "PlainText",
                "content" : returnText
            }
        }
    }
    
    return message
