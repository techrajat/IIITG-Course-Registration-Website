from flask import *
app = Flask(__name__)

from flask_cors import CORS
CORS(app)

import middleware.middleware as middleware
app.wsgi_app = middleware.AuthenticationMiddleware(app.wsgi_app)

import routes.users as users
app.register_blueprint(users.users_bp)

import routes.regStatus as regStatus
app.register_blueprint(regStatus.status_bp)

import routes.courses as courses
app.register_blueprint(courses.courses_bp)

import routes.payment as payment
app.register_blueprint(payment.pay_bp)

import routes.receipt as receipt
app.register_blueprint(receipt.receipt_bp)

import routes.verify_payment as verify_payment
app.register_blueprint(verify_payment.verify_bp)

import routes.elective_allocation as elective_allocation
app.register_blueprint(elective_allocation.allocation_bp)

import routes.elective_change as elective_change
app.register_blueprint(elective_change.changes_bp)

import routes.feedback as feedback
app.register_blueprint(feedback.feedback_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)