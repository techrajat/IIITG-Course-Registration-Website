from flask import *
courses_bp = Blueprint("courses_bp", __name__)

import pymongo
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['IIITG']
collection = db['Courses']

@courses_bp.route("/getcourse", methods=['POST'])
def registered():
    try:
        user = request.environ['user']
        if(not user):
          return {"error": "Authentication failed"}, 400  
        semester = request.form['sem']
        branch = request.form['branch']
        course = collection.find_one({"semester": int(semester), "branch": branch}, {"_id": 0})
        return {"course": course}, 200
    except:
        return {"error": "Server error"}, 500