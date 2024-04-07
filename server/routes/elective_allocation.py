from flask import *
allocation_bp = Blueprint("allocation_bp", __name__)

from dotenv import load_dotenv
load_dotenv()

import os
import pymongo

mongodb_conn_string = os.environ.get("mongodb_conn_string")
myclient = pymongo.MongoClient(mongodb_conn_string)
db = myclient["IIITG"]
regStatus_db = db["RegStatus"]
courses_db = db["Courses"]

def allocate_electives(students, electives, max_capacity):
    allocation_result = {f"{elective['code']}:{elective['name']}": [] for elective in electives}
    sorted_students = sorted(students, key=lambda x: x["cpi"], reverse=True)

    for student in sorted_students:
        for order_of_choices in student["selected_elective"]:
            for choice in order_of_choices:
                choice_desc = f"{choice['code']}:{choice['name']}"
                if (
                    allocation_result.get(choice_desc) is not None 
                    and len(allocation_result[choice_desc]) < max_capacity[choice_desc]
                   ):
                    allocation_result[choice_desc].append(student["roll_number"])
                    break
    return allocation_result

def update_students(allocation_result, students):
    allotted_electives = {}
    for student in students:
        allotted_electives[student["roll_number"]] = []

    for elective, allocated_students in allocation_result.items():
        split_string = elective.split(":", 1)
        for roll in allocated_students:
            allotted_electives[roll].append({'code': split_string[0], 'name': split_string[1]})

    for roll, selected_electives in allotted_electives.items():
        existing_allotted_electives = regStatus_db.find_one({'roll_number': roll})['allotted_elective']
        if existing_allotted_electives is None or len(existing_allotted_electives) == 0:
            regStatus_db.update_one({'roll_number': roll}, {'$set': {'allotted_elective': selected_electives}})
        else:
            updated_allotted_electives = existing_allotted_electives + selected_electives
            regStatus_db.update_one({'roll_number': roll}, {'$set': {'allotted_elective': updated_allotted_electives}})

def update_elective_capacity(allocation_result, semester, branch):
    courses_collection = courses_db.find_one({"semester": int(semester) + 1, "branch": branch})
    electives_collection = courses_collection['electives']
    for elective_db in electives_collection:
        for choice in elective_db:
            allocated_size = len(allocation_result[f"{choice['code']}:{choice['name']}"])
            choice['remaining_capacity'] -= allocated_size

    courses_db.update_one(
        {"semester": int(semester) + 1, "branch": branch}, 
        {"$set": {"electives": electives_collection}}
    )


@allocation_bp.route("/allocate", methods=['POST'])
def allocate():
    try:
        user = request.environ['user']
        if not user or not user['admin']:
          return {"error": "Authentication failed"}, 400
        semester = request.form['semester']
        branch = request.form['branch']

        if branch == "All":
            students_collection = regStatus_db.find(
                {
                 'semester': int(semester),
                 'status': 1,
                 'selected_elective': {'$ne': None}
                },
                {'_id': 0}
            )
        else:
            students_collection = regStatus_db.find(
                {'semester': int(semester),
                 'status': 1,
                 'branch': branch,
                 'selected_elective': {'$ne': None}
                },
                {'_id': 0}
            )
        students = []
        for student in students_collection:
            students.append(student)
        
        courses_collection = courses_db.find_one({"semester": int(semester) + 1, "branch": branch})
        electives_db = courses_collection['electives']
        electives = []
        max_capacity = {}
        for elective in electives_db:
            for choice in elective:
                electives.append(choice)
                max_capacity[f"{choice['code']}:{choice['name']}"] = choice['remaining_capacity']

        allocation_result = allocate_electives(students, electives, max_capacity)
        
        update_students(allocation_result, students)

        update_elective_capacity(allocation_result, semester, branch)

        return {"sucess": "Electives allocated successfully"}, 200
    except:
        return {"error": "Server error"}, 500