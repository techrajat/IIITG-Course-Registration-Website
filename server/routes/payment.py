from flask import *

pay_bp = Blueprint("pay_bp", __name__)

from dotenv import load_dotenv

load_dotenv()

import os

Razor_key_id = os.environ.get("Razor_key_id")
Razor_key_secret = os.environ.get("Razor_key_secret")
Total_Fee = os.environ.get("Total_Fee")

import pymongo

mongodb_conn_string = os.environ.get("mongodb_conn_string")
myclient = pymongo.MongoClient(mongodb_conn_string)
db = myclient["IIITG"]
students = db["Students"]
regStatus = db["RegStatus"]
paymentsDB = db["Payments"]
uploadedReceipts = db["UploadedReceipts"]
verifiedReceipts = db["VerifiedReceipts"]

from datetime import date, datetime
import pytz

import hmac
import hashlib
import razorpay


@pay_bp.route("/createbill", methods=["POST"])
def createbill():
    try:
        user = request.environ["user"]
        if not user:
            return {"error": "Authentication failed"}, 400
        amount = request.form["amount"]
        client = razorpay.Client(auth=(Razor_key_id, Razor_key_secret))
        DATA = {"amount": amount, "currency": "INR", "receipt": "receipt#1"}
        order_response = client.order.create(data=DATA)
        order_id = order_response["id"]
        return {"order_id": order_id}, 200
    except:
        return {"error": "Server error"}, 500


def hmac_sha256(data, key):
    return hmac.new(key.encode("utf-8"), data.encode("utf-8"), hashlib.sha256).hexdigest()


@pay_bp.route("/payment/<roll>/<electives>", methods=["POST"])
def payment(roll, electives):
    try:
        details = request.form
        generated_signature = hmac_sha256(
            details["razorpay_order_id"] + "|" + details["razorpay_payment_id"],
            Razor_key_secret,
        )
        if generated_signature == details["razorpay_signature"]:
            try:
                regStatus.update_one(
                    {"roll_number": roll},
                    {"$set": {"status": 1, "selected_elective": json.loads(electives)}}
                )
            except:
                return {"error": "Student not found"}, 500
            user = students.find_one({"roll_number": roll}, {"_id": 0})
            today = date.today()
            today = today.strftime("%d-%m-%Y")
            ist_timezone = pytz.timezone("Asia/Kolkata")
            current_time_ist = datetime.now(ist_timezone).time()
            formatted_time_ist = current_time_ist.strftime("%H:%M:%S")
            paymentsDB.insert_one(
                {
                    "name": user["name"],
                    "email": user["email"],
                    "roll_number": user["roll_number"],
                    "semester": user["semester"],
                    "razorpay_payment_id": details["razorpay_payment_id"],
                    "razorpay_order_id": details["razorpay_order_id"],
                    "razorpay_signature": details["razorpay_signature"],
                    "date": today,
                    "time": formatted_time_ist,
                }
            )
            return render_template(
                "receipt.html",
                name=user["name"],
                email=user["email"],
                roll_number=user["roll_number"],
                razorpay_payment_id=details["razorpay_payment_id"],
                razorpay_order_id=details["razorpay_order_id"],
                razorpay_signature=details["razorpay_signature"],
                date=today,
                time=formatted_time_ist,
                amount=Total_Fee,
            )
        else:
            return {"error": "Wrong signature"}, 400
    except:
        return {"error": "Server error"}, 500


@pay_bp.route("/selectelectives/<electives>")
def selectelectives(electives):
    user = request.environ["user"]
    try:
        regStatus.update_one(
            {"roll_number": user["roll_number"]},
            {"$set": {"selected_elective": json.loads(electives)}}
        )
    except:
        return {"error": "Student not found"}, 500
    return {"success": "Electives selected successfully"}, 200


@pay_bp.route("/paystatus")
def paystatus():
    try:
        user = request.environ["user"]
        if not user:
            return {"error": "Authentication failed"}, 400
        paid = regStatus.find_one({"roll_number": user["roll_number"]}, {"_id": 0})
        receiptUploaded = uploadedReceipts.find_one({"roll_number": user["roll_number"]}, {"_id": 0})
        receiptVerified = verifiedReceipts.find_one({"roll_number": user["roll_number"]}, {"_id": 0})
        if receiptUploaded and receiptUploaded["verified"] == 1:
            return {"result": f"Your payment with reference number {receiptUploaded['reference_number']} has been verified."}, 200
        if receiptVerified:
            return {"result": "Receipt verified"}, 201
        elif paid["status"] == 1:
            return {"result": "Paid with RazorPay"}, 202
        elif receiptUploaded and receiptUploaded["verified"] == 0 and receiptUploaded["declined"] == 0:
            return {"result": "Uploaded"}, 203
        elif receiptUploaded and receiptUploaded["declined"] == 1:
            return jsonify({
                "result": f"Your payment with reference number {receiptUploaded['reference_number']} has been declined.",
                "reason": receiptUploaded['decline_reason']
            }), 200
        else:
            return {"result": "Not paid"}, 400
    except:
        return {"error": "Server error"}, 500
