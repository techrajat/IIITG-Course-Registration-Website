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
        selected_electives = student["selected_elective"]
        for order_of_choices in selected_electives:
            for choice in order_of_choices:
                choice_desc = f"{choice['code']}:{choice['name']}"
                if len(allocation_result[choice_desc]) < max_capacity[choice_desc]:
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
        regStatus_db.update_one({'roll_number': roll}, {'$set': {'allotted_elective': selected_electives}})

@allocation_bp.route("/allocate", methods=['POST'])
def allocate():
    try:
        user = request.environ['user']
        if not user or not user['admin']:
          return {"error": "Authentication failed"}, 400
        semester = request.form['semester']
        branch = request.form['branch']
        max_capacity = request.form['maxCapacity']
        max_capacity = json.loads(max_capacity)

        students_collection = regStatus_db.find({'semester': int(semester), 'status': 1}, {'_id': 0})
        students = []
        for student in students_collection:
            students.append(student)
        
        courses_collection = courses_db.find_one({"branch": branch})
        electives_db = courses_collection['electives']
        electives = []
        for elective in electives_db:
            for choice in elective:
                electives.append(choice)

        allocation_result = allocate_electives(students, electives, max_capacity)
        
        update_students(allocation_result, students)

        return {"sucess": "Electives allocated successfully"}, 200
    except:
        return {"error": "Server error"}, 500