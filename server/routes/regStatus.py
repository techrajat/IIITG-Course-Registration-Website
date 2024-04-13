from flask import *
status_bp = Blueprint("status_bp", __name__)

from dotenv import load_dotenv
load_dotenv()

import os
mongodb_conn_string = os.environ.get('mongodb_conn_string')
import pymongo
myclient = pymongo.MongoClient(mongodb_conn_string)
db = myclient['IIITG']
collection = db['RegStatus']

@status_bp.route("/registered", methods=['POST'])
def registered():
    try:
        user = request.environ['user']
        if not user or not user['admin']:
          return {"error": "Authentication failed"}, 401
        semester = request.form['semester']
        branch = request.form['branch']
        if branch == "All":
           students = collection.find({"semester": int(semester), "status": 1}, {'_id': 0})
        else:
            students = collection.find({"semester": int(semester), "branch": branch, "status": 1}, {'_id': 0})
        students = list(students)
        result = [dict(student) for student in students]
        return {"result": result}, 200
    except:
        return {"error": "Authentication failed"}, 401

@status_bp.route("/unregistered", methods=['POST'])
def unregistered():
    try:
        user = request.environ['user']
        if not user or not user['admin']:
          return {"error": "Authentication failed"}, 401
        semester = request.form['semester']
        branch = request.form['branch']
        if branch == "All":
           students = collection.find({"semester": int(semester), "status": 0}, {'_id': 0})
        else:
            students = collection.find({"semester": int(semester), "branch": branch, "status": 0}, {'_id': 0})
        students = list(students)
        result = [dict(student) for student in students]
        return {"result": result}, 200
    except:
        return {"error": "Authentication failed"}, 401
    
@status_bp.route("/elective/students", methods=['POST'])
def coursewise():
    try:
        user = request.environ['user']
        if not user or not user['admin']:
          return {"error": "Authentication failed"}, 401
        semester = request.form['semester']
        elective = request.form['elective']
        students = collection.find({'semester': int(semester)}, {'_id': 0})
        students = list(students)
        result = []
        for student in students:
            if student['allotted_elective'] is not None:
              for allotted in student['allotted_elective']:
                  if elective == f"{allotted['code']}:{allotted['name']}":
                      result.append({'name': student['name'], 'roll_number': student['roll_number'], 'branch': student['branch']})
        return {"result": result}, 200
    except:
        return {"error": "Authentication failed"}, 401