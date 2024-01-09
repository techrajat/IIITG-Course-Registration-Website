from flask import *
app = Flask(__name__)

from flask_cors import CORS
CORS(app)

import routes.users as users
app.register_blueprint(users.users_bp)

import routes.regStatus as regStatus
app.register_blueprint(regStatus.status_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)