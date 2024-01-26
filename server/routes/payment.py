from flask import *
pay_bp = Blueprint("pay_bp", __name__)

from dotenv import load_dotenv
load_dotenv()

import os
Razor_key_id = os.environ.get('Razor_key_id')
Razor_key_secret = os.environ.get('Razor_key_secret')

import pymongo
mongodb_conn_string = os.environ.get('mongodb_conn_string')
myclient = pymongo.MongoClient(mongodb_conn_string)
db = myclient['IIITG']
collection = db['Payments']

import hmac
import hashlib
import razorpay

global_user = ""
global_order_id = ""

@pay_bp.route("/createbill", methods=['POST'])
def createbill():
    try:
        user = request.environ['user']
        if(not user):
          return {"error": "Authentication failed"}, 400
        global global_user
        global_user = user
        amount = request.form['amount']
        client = razorpay.Client(auth=(Razor_key_id, Razor_key_secret))
        DATA = {
            "amount": amount,
            "currency": "INR",
            "receipt": "receipt#1"
        }
        order_response = client.order.create(data=DATA)
        order_id = order_response['id']
        global global_order_id
        global_order_id = order_id
        return {"order_id": order_id}, 200
    except:
        return {"error": "Server error"}, 500

def hmac_sha256(data, key):
    return hmac.new(key.encode('utf-8'), data.encode('utf-8'), hashlib.sha256).hexdigest()

@pay_bp.route("/payment", methods=['POST'])
def payment():
    try:
        details = request.form
        global global_order_id
        generated_signature = hmac_sha256(global_order_id + "|" + details['razorpay_payment_id'], Razor_key_secret)
        if (generated_signature == details['razorpay_signature']):
            collection.insert_one({'name': global_user['name'], 'email': global_user['email'], 'roll_number': global_user['roll_number'], 'razorpay_payment_id': details['razorpay_payment_id'], 'razorpay_order_id': details['razorpay_order_id'], 'razorpay_signature': details['razorpay_signature']})
            return redirect('http://127.0.0.1:3000/studenthero')
        else:
            return {"error": "Wrong signature"}, 400
    except:
        return {"error": "Server error"}, 500