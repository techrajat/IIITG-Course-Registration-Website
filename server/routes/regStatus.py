from flask import *
status_bp = Blueprint("status_bp", __name__)

import pymongo
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['IIITG']
collection = db['RegStatus']

@status_bp.route("/registered", methods=['POST'])
def registered():
    try:
        user = request.environ['user']
        if(not user):
          return {"error": "Authentication failed"}, 400  
        semester = request.form['sem']
        students = collection.find({"semester": int(semester), "status": 1})
        students = list(students)
        result = [dict(student) for student in students]
    except:
        return {"error": "Server error"}, 500
    return {"result": result}, 200

@status_bp.route("/unregistered", methods=['POST'])
def unregistered():
    try:
        user = request.environ['user']
        if(not user):
          return {"error": "Authentication failed"}, 400
        semester = request.form['sem']
        students = collection.find({"semester": int(semester), "status": 0}, {'_id': 0})
        students = list(students)
        result = [dict(student) for student in students]
        return {"result": result}, 200
    except:
        return {"error": "Server error"}, 500