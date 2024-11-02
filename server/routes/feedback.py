from flask import *

feedback_bp = Blueprint("feedback_bp", __name__)

from dotenv import load_dotenv

load_dotenv()

import os
import pymongo

mongodb_conn_string = os.environ.get("mongodb_conn_string")
myclient = pymongo.MongoClient(mongodb_conn_string)
db = myclient["IIITG"]
groups = db["Student-Groups"]
facultyDB = db["Faculty"]
feedbackDB = db["Feedback"]

@feedback_bp.route("/feedbackdetails")
def feedbackdetails():
    try:
        user = request.environ["user"]
        if not user:
            return {"error": "Authentication failed"}, 401
        roll = user["roll_number"]
        semester = user["semester"]
        branch = user["branch"]
        student = groups.find_one({'roll_number': roll, 'semester': semester, 'branch': branch}, {'_id': 0})
        courses = {}
        if student:
            for group_name, courses_dict in student['courses'].items():
                for course_code, course_name in courses_dict.items():
                    faculty = facultyDB.find_one({'group': group_name, 'semester': semester, 'course': f"{course_code}: {course_name}"}, {'_id': 0})
                    courses[f"{course_code}: {course_name}"] = faculty['name']
        return {"courses": courses}, 200
    except:
        return {"error": "Authentication failed"}, 401

@feedback_bp.route("/submitfeedback", methods=["POST"])
def submitfeedback():
    try:
        user = request.environ["user"]
        if not user:
            return {"error": "Authentication failed"}, 401
        course = request.form["course"]
        faculty = request.form["faculty"]
        semester = request.form["semester"]
        feedback = request.form["feedback"]
        feedback = json.loads(feedback)
        feedbackDB.insert_one({'course': course, 'semester': int(semester), 'faculty': faculty, 'feedback': feedback})
        return {"success": "Feedback submitted successfully"}, 200
    except:
        return {"error": "Authentication failed"}, 401