from flask import *
from bson import ObjectId
import jwt
import os
from dotenv import load_dotenv
load_dotenv()
JWT_Secret = os.environ.get("JWT_Secret")
import pymongo
mongodb_conn_string = os.environ.get("mongodb_conn_string")
myclient = pymongo.MongoClient(mongodb_conn_string)
mydb = myclient['IIITG']
student = mydb['Credentials']
adminCred = mydb['Admin']

class AuthenticationMiddleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        isAdmin = environ.get('HTTP_ADMIN')
        if(isAdmin and int(isAdmin) == 1):
            collection = adminCred
        else:
            collection = student
        # Extract the authorization token from the 'Authorization' header :-
        authorization_header = environ.get('HTTP_AUTHORIZATION')
        if authorization_header:
            token = authorization_header
            user = jwt.decode(token, JWT_Secret, algorithms="HS256")
            id = ObjectId(user['id'])
            user = collection.find_one({"_id": id})
            if(user):
                user.pop("password") # Remove password before sending user details to the endpoint
                environ['user'] = user
                return self.app(environ, start_response)
            else:
                # Handle unauthorized access
                res = Response(u'Authorization failed', mimetype= 'text/plain', status=401)
                return res(environ, start_response)
        
        return self.app(environ, start_response)