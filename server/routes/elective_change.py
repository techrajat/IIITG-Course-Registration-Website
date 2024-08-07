from flask import *
changes_bp = Blueprint("changes_bp", __name__)

from dotenv import load_dotenv
load_dotenv()

import os
import pymongo
mongodb_conn_string = os.environ.get('mongodb_conn_string')
myclient = pymongo.MongoClient(mongodb_conn_string)
db = myclient['IIITG']
electiveChangeDB = db['Elective-Change']

@changes_bp.route("/electivechangereq")
def electivechangereq():
    try:
        user = request.environ["user"]
        if not user:
            return {"error": "Authentication failed"}, 401
        student = electiveChangeDB.find_one({"roll_number": user["roll_number"]})
        if(student):
            return {"result": "Elective change request already made"}, 400
        return {"result": "Elective change request not made yet"}, 200
    except:
        return {"error": "Authentication failed"}, 401
    
@changes_bp.route("/requestchange", methods=["POST"])
def requestchange():
    try:
        user = request.environ["user"]
        if not user:
            return {"error": "Authentication failed"}, 401
        electives = request.form["alternateElectives"]
        electives = json.loads(electives)
        for elective in electives:
            electiveChangeDB.insert_one({
                "roll_number": user["roll_number"],
                "name": user["name"],
                "branch": user["branch"],
                "semester": int(user["semester"]),
                "from": elective["from"],
                "to": elective["to"]
            })
        return {"success": "Electives change request made successfully"}, 200
    except:
        return {"error": "Authentication failed"}, 401