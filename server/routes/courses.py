from flask import *
courses_bp = Blueprint("courses_bp", __name__)

from dotenv import load_dotenv
load_dotenv()

import os
import pymongo
mongodb_conn_string = os.environ.get('mongodb_conn_string')
myclient = pymongo.MongoClient(mongodb_conn_string)
db = myclient['IIITG']
collection = db['Courses']

@courses_bp.route("/getcourse", methods=['POST'])
def registered():
    try:
        user = request.environ['user']
        if(not user):
          return {"error": "Authentication failed"}, 400
        semester = request.form['semester']
        branch = request.form['branch']
        course = collection.find_one({"semester": int(semester), "branch": branch}, {"_id": 0})
        return {"course": course}, 200
    except:
        return {"error": "Server error"}, 500