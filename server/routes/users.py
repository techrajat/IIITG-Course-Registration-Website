from flask import *
users_bp = Blueprint("users_bp", __name__)
    
@users_bp.route('/getuser')
def getuser():
    user = request.environ['user']
    if user:
        return {"user": user}, 200
    else:
        return {"error": "Access denied"}, 400