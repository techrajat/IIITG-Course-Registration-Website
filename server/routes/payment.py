from flask import *
pay_bp = Blueprint("pay_bp", __name__)

from dotenv import load_dotenv
load_dotenv()

import os
Razor_key_id = os.environ.get('Razor_key_id')
Razor_key_secret = os.environ.get('Razor_key_secret')
Total_Fee = os.environ.get('Total_Fee')

import pymongo
mongodb_conn_string = os.environ.get('mongodb_conn_string')
myclient = pymongo.MongoClient(mongodb_conn_string)
db = myclient['IIITG']
students = db['Students']
paymentsDB = db['Payments']
uploadedReceipts = db['UploadedReceipts']

from datetime import date, datetime
import pytz

import hmac
import hashlib
import razorpay

@pay_bp.route("/createbill", methods=['POST'])
def createbill():
    try:
        user = request.environ['user']
        if(not user):
          return {"error": "Authentication failed"}, 400
        amount = request.form['amount']
        client = razorpay.Client(auth=(Razor_key_id, Razor_key_secret))
        DATA = {
            "amount": amount,
            "currency": "INR",
            "receipt": "receipt#1"
        }
        order_response = client.order.create(data=DATA)
        order_id = order_response['id']
        return {"order_id": order_id}, 200
    except:
        return {"error": "Server error"}, 500

def hmac_sha256(data, key):
    return hmac.new(key.encode('utf-8'), data.encode('utf-8'), hashlib.sha256).hexdigest()

@pay_bp.route("/payment/<roll>", methods=['POST'])
def payment(roll):
    try:
        details = request.form
        generated_signature = hmac_sha256(details['razorpay_order_id'] + "|" + details['razorpay_payment_id'], Razor_key_secret)
        if (generated_signature == details['razorpay_signature']):
            user = students.find_one({'roll_number': roll}, {'_id': 0})
            today = date.today()
            today = today.strftime("%d-%m-%Y")
            ist_timezone = pytz.timezone('Asia/Kolkata')
            current_time_ist = datetime.now(ist_timezone).time()
            formatted_time_ist = current_time_ist.strftime("%H:%M:%S")
            paymentsDB.insert_one({'name': user['name'], 'email': user['email'], 'roll_number': user['roll_number'], 'semester': user['semester'], 'razorpay_payment_id': details['razorpay_payment_id'], 'razorpay_order_id': details['razorpay_order_id'], 'razorpay_signature': details['razorpay_signature'], 'date': today, 'time': formatted_time_ist})
            return render_template('receipt.html', name=user['name'], email=user['email'], roll_number=user['roll_number'], razorpay_payment_id=details['razorpay_payment_id'], razorpay_order_id=details['razorpay_order_id'], razorpay_signature=details['razorpay_signature'], date=today, time=formatted_time_ist, amount=Total_Fee)
        else:
            return {"error": "Wrong signature"}, 400
    except:
        return {"error": "Server error"}, 500
    
@pay_bp.route("/receipt")
def receipt():
    try:
        user = request.environ['user']
        if(not user):
          return {"error": "Authentication failed"}, 400
        receipt = paymentsDB.find_one({'roll_number': user['roll_number']}, {'_id': 0})
        return {"result": receipt}, 200
    except:
        return {"error": "Server error"}, 500
    
@pay_bp.route("/paystatus")
def paystatus():
    try:
        user = request.environ['user']
        if(not user):
          return {"error": "Authentication failed"}, 400
        receipt = paymentsDB.find_one({'roll_number': user['roll_number']}, {'_id': 0})
        if receipt:
            return {"result": "Paid"}, 200
        else:
            return {"result": "Not paid"}, 400
    except:
        return {"error": "Server error"}, 500
    
@pay_bp.route("/uploadreceipt", methods=['POST'])
def uploadreceipt():
    try:
        user = request.environ['user']
        if(not user):
          return {"error": "Authentication failed"}, 400
        details = request.form
        uploadedReceipts.insert_one({'name': user['name'], 'email': user['email'], 'roll_number': user['roll_number'], 'semester': user['semester'], 'reference_number': details['ref'], 'date_of_payment': details['date_of_payment'], 'receipt': details['receipt']})
        return {"success": "Receipt uploaded"}, 200
    except:
        return {"error": "Server error"}, 500