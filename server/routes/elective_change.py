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
courses_db = db["Courses"]
regStatus_db = db["RegStatus"]

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
        branch = user["branch"]
        for elective in electives:
            if(elective["from"]["code"][:2] == "HS"):
                branch = "All"
            electiveChangeDB.insert_one({
                "roll_number": user["roll_number"],
                "name": user["name"],
                "branch": branch,
                "cpi": user["cpi"],
                "semester": int(user["semester"]),
                "from": elective["from"],
                "to": elective["to"]
            })
        return {"success": "Electives change request made successfully"}, 200
    except:
        return {"error": "Authentication failed"}, 401
    
@changes_bp.route("/changeelectives", methods=["POST"])
def changeelectives():
    try:
        user = request.environ["user"]
        if not user or not user['admin']:
            return {"error": "Authentication failed"}, 401
        semester = request.form['semester']
        branch = request.form['branch']
        changeRequests = electiveChangeDB.find({"semester": int(semester), "branch": branch}, {"_id": 0}).sort({ "cpi": -1 })
        electives_db = courses_db.find_one({"semester": int(semester) + 1, "branch": branch}, {"_id": 0})
        electives = electives_db['electives']
        for doc in list(changeRequests):
            fromElective = doc['from']
            toElective = doc['to']
            findFrom = None
            findTo = None
            for choice in electives:
                for elective in choice:
                    if(elective['code'] == toElective['code'] and elective['name'] == toElective['name']):
                        if(elective['remaining_capacity'] > 0):
                            findTo = elective
                    if(elective['code'] == fromElective['code'] and elective['name'] == fromElective['name']):
                        findFrom = elective
                if findTo != None and findFrom != None:
                    findTo['remaining_capacity'] = findTo['remaining_capacity'] - 1
                    findTo['students'].append(doc['roll_number'])
                    findFrom['remaining_capacity'] = findFrom['remaining_capacity'] + 1
                    findFrom['students'].remove(doc['roll_number'])
                    for elective in choice:
                        if(elective['code'] == toElective['code'] and elective['name'] == toElective['name']):
                            elective = findTo
                        if(elective['code'] == fromElective['code'] and elective['name'] == fromElective['name']):
                            elective = findFrom
                    courses_db.update_one(
                        {"semester": int(semester) + 1, "branch": branch}, 
                        {"$set": {"electives": electives}}
                    )
                    student = regStatus_db.find_one({"roll_number": doc["roll_number"]}, {"_id": 0})
                    allotted = student["allotted_elective"]
                    for elective in allotted:
                        if elective['code'] == findFrom['code'] and elective['name'] == findFrom['name']:
                            elective['code'] = findTo['code']
                            elective['name'] = findTo['name']
                            regStatus_db.update_one(
                                {"roll_number": doc['roll_number']}, 
                                {"$set": {"allotted_elective": allotted}}
                            )
                            break

        return {"success": "Electives changed successfully"}, 200
    except:
        return {"error": "Authentication failed"}, 401