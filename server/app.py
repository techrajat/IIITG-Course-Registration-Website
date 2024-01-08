from flask import *
app = Flask(__name__)

from flask_cors import CORS
CORS(app)

import pymongo
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['IIITG']
collection = db['RegStatus']

@app.route("/registered", methods=['POST'])
def registered():
    try:
        semester = request.form['sem']
        students = collection.find({"semester": int(semester), "status": 1})
        students = list(students)
        result = [dict(student) for student in students]
    except:
        return {"error": "Server error"}, 500
    return {"result": result}, 200

@app.route("/unregistered", methods=['POST'])
def unregistered():
    try:
        semester = request.form['sem']
        students = collection.find({"semester": int(semester), "status": 0}, {'_id': 0})
        students = list(students)
        result = [dict(student) for student in students]
        return {"result": result}, 200
    except:
        return {"error": "Server error"}, 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)