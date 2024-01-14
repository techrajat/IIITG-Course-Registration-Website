from flask import *
users_bp = Blueprint("users_bp", __name__)

import bcrypt
import jwt

import pymongo
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient['IIITG']
students = mydb['Students']
credentials = mydb['Credentials']
adminCred = mydb['Admin']

@users_bp.route('/register', methods=['POST'])
def register():
    try:
        name = request.form['name']
        email = request.form['email']
        match = students.find_one({"name": name, "email": email})
        if(not match):
            return {"error": "Wrong name or email"}, 400
        registered = credentials.find_one({"email": email})
        if(registered):
            return {"error": "Student already registered"}, 400
        password = request.form['password']
        password = password.encode("utf-8")
        hashed = bcrypt.hashpw(password, bcrypt.gensalt())
        credentials.insert_one({"name": request.form['name'], "email": request.form['email'], "password": hashed})
        return {"success": "Registration successful"}, 200
    except:
        return {"error": "Internal server error"}, 500
    
@users_bp.route('/login', methods=['POST'])
def login():
    try:
        email = request.form['email']
        password = request.form['password'].encode("utf-8")
        admin = int(request.form['admin'])
        if(admin):
            user = adminCred.find_one({"email": email})
            if not user:
                return {"error": "Wrong login credentials"}, 400
            hashed = user['password']
            if bcrypt.checkpw(password, hashed):
                encoded_jwt = jwt.encode({"id": str(user['_id'])}, "SignedByRK", algorithm="HS256")
                return {"token": encoded_jwt}, 200
            else:
                return {"error": "Wrong login credentials"}, 400
        else:
            user = credentials.find_one({"email": email})
            if not user:
                return {"error": "Wrong login credentials"}, 400
            hashed = user['password']
            if bcrypt.checkpw(password, hashed):
                encoded_jwt = jwt.encode({"id": str(user['_id'])}, "SignedByRK", algorithm="HS256")
                return {"token": encoded_jwt}, 200
            else:
                return {"error": "Wrong login credentials"}, 400
    except:
        return {"error": "Internal server error"}, 500
    
@users_bp.route('/getuser')
def getuser():
    try:
        user = request.environ['user']
        return {"name": user['name']}, 200
    except:
        return {"error": "Internal server error"}, 500