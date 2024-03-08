from flask import *

verify_bp = Blueprint("verify_bp", __name__)

from dotenv import load_dotenv

load_dotenv()

import os
import pymongo

mongodb_conn_string = os.environ.get("mongodb_conn_string")
myclient = pymongo.MongoClient(mongodb_conn_string)
db = myclient["IIITG"]
students = db["Students"]
regStatus = db["RegStatus"]
uploadedReceipts = db["UploadedReceipts"]
verifiedReceipts = db["VerifiedReceipts"]


@verify_bp.route("/verifypayment", methods=["POST"])
def verifypayment():
    try:
        user = request.environ["user"]
        if not user or not user['admin']:
            return {"error": "Authentication failed"}, 400
        roll = request.form["roll"]
        try:
            regStatus.update_one({"roll_number": roll}, {"$set": {"status": 1}})
            uploadedReceipts.update_one({"roll_number": roll}, {"$set": {"verified": 1}})
            receipt = uploadedReceipts.find_one({"roll_number": roll})
            student = students.find_one({"roll_number": roll})
            verifiedReceipts.insert_one(
                {
                    "name": student["name"],
                    "email": student["email"],
                    "roll_number": student["roll_number"],
                    "semester": student["semester"],
                    "reference_number": receipt["reference_number"],
                    "date_of_payment": receipt["date_of_payment"],
                    "receipt": receipt["receipt"],
                }
            )
        except:
            return {"error": "Student not found"}, 500
        return {"result": "Payment verified"}, 200
    except:
        return {"error": "Server error"}, 500


@verify_bp.route("/declinepayment", methods=["POST"])
def declinepayment():
    try:
        user = request.environ["user"]
        if not user or not user['admin']:
            return {"error": "Authentication failed"}, 400
        roll = request.form["roll"]
        reason = request.form["reason"]
        try:
            uploadedReceipts.update_one(
                {"roll_number": roll},
                {"$set": {"declined": 1, "decline_reason": reason}},
            )
        except:
            return {"error": "Student not found"}, 500
        return {"result": "Payment declined"}, 200
    except:
        return {"error": "Server error"}, 500