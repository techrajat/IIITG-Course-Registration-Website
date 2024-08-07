from flask import *
courses_bp = Blueprint("courses_bp", __name__)

from dotenv import load_dotenv
load_dotenv()

import os
import pymongo
mongodb_conn_string = os.environ.get('mongodb_conn_string')
myclient = pymongo.MongoClient(mongodb_conn_string)
db = myclient['IIITG']
courses_db = db['Courses']
regStatus = db['RegStatus']
electiveChangeDB = db['Elective-Change']

@courses_bp.route("/getcourse", methods=['POST'])
def registered():
    try:
        user = request.environ['user']
        if not user:
          return {"error": "Authentication failed"}, 401
        semester = request.form['semester']
        branch = request.form['branch']
        course = courses_db.find_one({"semester": int(semester), "branch": branch}, {"_id": 0})
        return {"course": course}, 200
    except:
        return {"error": "Authentication failed"}, 401

@courses_bp.route("/viewselectedelectives")
def viewselectedelectives():
    try:
        user = request.environ['user']
        if not user:
          return {"error": "Authentication failed"}, 401
        student = regStatus.find_one({"roll_number": user['roll_number']}, {"_id": 0})
        return {"electives": student['selected_elective']}, 200
    except:
        return {"error": "Authentication failed"}, 401
    
@courses_bp.route("/viewallottedelectives")
def viewallottedelectives():
    try:
        user = request.environ['user']
        if not user:
          return {"error": "Authentication failed"}, 401
        student = regStatus.find_one({"roll_number": user['roll_number']}, {"_id": 0})
        return {"electives": student['allotted_elective']}, 200
    except:
        return {"error": "Authentication failed"}, 401
    
@courses_bp.route("/selectelectives", methods=["POST"])
def selectelectives():
    try:
        user = request.environ["user"]
        if not user:
            return {"error": "Authentication failed"}, 401
        electives = request.form["selectedElectives"]
        regStatus.update_one(
            {"roll_number": user["roll_number"]},
            {"$set": {"selected_elective": json.loads(electives)}}
        )
        return {"success": "Electives selected successfully"}, 200
    except:
        return {"error": "Authentication failed"}, 401