from flask import *

receipt_bp = Blueprint("receipt_bp", __name__)

from dotenv import load_dotenv

load_dotenv()

import os
import pymongo

mongodb_conn_string = os.environ.get("mongodb_conn_string")
myclient = pymongo.MongoClient(mongodb_conn_string)
db = myclient["IIITG"]
paymentsDB = db["Payments"]
uploadedReceipts = db["UploadedReceipts"]
verifiedReceipts = db["VerifiedReceipts"]

@receipt_bp.route("/getreceipt")
def getreceipt():
    try:
        user = request.environ["user"]
        if not user:
            return {"error": "Authentication failed"}, 400
        receipt = paymentsDB.find_one({"roll_number": user["roll_number"]}, {"_id": 0})
        return {"result": receipt}, 200
    except:
        return {"error": "Server error"}, 500

@receipt_bp.route("/uploadreceipt", methods=["POST"])
def uploadreceipt():
    try:
        user = request.environ["user"]
        if not user:
            return {"error": "Authentication failed"}, 400
        details = request.form
        parsed_files = json.loads(details["files"])
        files = []
        for _, value in parsed_files.items():
            files.append(value)
        alreadyUploaded = uploadedReceipts.find_one({"roll_number": user["roll_number"]}, {"_id": 0})
        if alreadyUploaded is not None:
            return {"error": "Receipt already uploaded"}, 401
        uploadedReceipts.insert_one(
            {
                "name": user["name"],
                "email": user["email"],
                "roll_number": user["roll_number"],
                "semester": user["semester"],
                "reference_number": details["ref"],
                "date_of_payment": details["date_of_payment"],
                "receipt": files,
                "verified": 0,
                "declined": 0,
                "decline_reason": None,
            }
        )
        return {"success": "Receipt uploaded"}, 200
    except:
        return {"error": "Server error"}, 500

@receipt_bp.route("/deletereceipt")
def deletereceipt():
    try:
        user = request.environ["user"]
        if not user:
            return {"error": "Authentication failed"}, 400
        result = uploadedReceipts.delete_one({"roll_number": user["roll_number"]})
        if result.deleted_count == 1:
            return {"success": "Receipt deleted"}, 200
        else:
            return {"error": "Receipt not found"}, 400
    except:
        return {"error": "Server error"}, 500

@receipt_bp.route("/getuploadedreceipts", methods=["POST"])
def getuploadedreceipts():
    try:
        user = request.environ["user"]
        if not user or not user['finance']:
            return {"error": "Authentication failed"}, 400
        semester = request.form["sem"]
        receipts = uploadedReceipts.find({"semester": int(semester)}, {"_id": 0})
        receipts = list(receipts)
        result = [dict(receipt) for receipt in receipts if receipt["verified"] != 1 and receipt["declined"] != 1]
        return {"result": result}, 200
    except:
        return {"error": "Server error"}, 500

@receipt_bp.route("/getverifiedpayments", methods=["POST"])
def getverifiedpayments():
    try:
        user = request.environ["user"]
        if not user or not user['finance']:
            return {"error": "Authentication failed"}, 400
        semester = request.form["sem"]
        receipts = verifiedReceipts.find({"semester": int(semester)}, {"_id": 0})
        receipts = list(receipts)
        result = [dict(receipt) for receipt in receipts]
        return {"result": result}, 200
    except:
        return {"error": "Server error"}, 500