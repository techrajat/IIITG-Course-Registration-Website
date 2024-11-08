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

@feedback_bp.route("/getfaculty/<semester>")
def getfaculty(semester):
    try:
        user = request.environ["user"]
        if not user:
            return {"error": "Authentication failed"}, 401
        faculty = facultyDB.find({'semester': int(semester)}, {'_id': 0})
        faculty = list(faculty)
        faculty = [dict(f) for f in faculty]
        return {"faculty": faculty}, 200
    except:
        return {"error": "Authentication failed"}, 401

@feedback_bp.route("/getfeedback", methods=['POST'])
def getfeedback():
    try:
        user = request.environ["user"]
        if not user or not user['admin']:
            return {"error": "Authentication failed"}, 401
        course = request.form["course"]
        faculty = request.form["faculty"]
        semester = request.form["semester"]
        feedbacks = feedbackDB.find({'course': course, 'faculty': faculty, 'semester': int(semester)}, {'_id': 0})
        f = {}
        for feedback in feedbacks:
            for question, answer in feedback['feedback'].items():
                if question == "additional_comments":
                    continue
                if question not in f:
                    f[question] = {
                        "strongly_disagree": 0,
                        "disagree": 0,
                        "agree": 0,
                        "strongly_agree": 0
                    }
                if answer in f[question]:
                    f[question][answer] += 1
        return {"feedback": f}, 200
    except:
        return {"error": "Authentication failed"}, 401