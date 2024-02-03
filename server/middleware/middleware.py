from flask import *
import requests
import os
from dotenv import load_dotenv
load_dotenv()
import pymongo
mongodb_conn_string = os.environ.get("mongodb_conn_string")
myclient = pymongo.MongoClient(mongodb_conn_string)
mydb = myclient['IIITG']
students = mydb['Students']
adminCred = mydb['Admin']

class AuthenticationMiddleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        authorization_header = environ.get('HTTP_AUTHORIZATION')
        if authorization_header:
            access_token = authorization_header
            url = f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={access_token}"
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Accept': 'application/json',
            }
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                user_info = response.json()
                user = adminCred.find_one({'email': user_info['email']}, {'_id': 0})
                if user:
                    user['admin'] = 1
                else:
                    user = students.find_one({'email': user_info['email']}, {'_id': 0})
                if(user):
                    environ['user'] = user
                    return self.app(environ, start_response)
            else:
                res = Response(u'Authorization failed', mimetype= 'text/plain', status=401)
                return res(environ, start_response)
        
        return self.app(environ, start_response)