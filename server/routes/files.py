from flask import *
from io import BytesIO
import pandas as pd
files_bp = Blueprint("files_bp", __name__)

from dotenv import load_dotenv
load_dotenv()

import os
mongodb_conn_string = os.environ.get('mongodb_conn_string')
import pymongo
myclient = pymongo.MongoClient(mongodb_conn_string)
db = myclient['IIITG']

@files_bp.route("/uploadfile", methods=['POST'])
def uploadfile():
    try:
        user = request.environ['user']
        if not user or not user['admin']:
            return {"error": "Authentication failed"}, 401

        file_data = request.json.get('fileData')
        collection_name = request.json.get('dataType')

        if not file_data or not collection_name:
            return {"message": "File data or collection name missing"}, 400

        collection = db[collection_name]
        collection.insert_many(file_data)

        return {'message': 'Data inserted successfully'}, 200

    except:
        return {"message": "An error occurred during upload"}, 500
    
@files_bp.route('/downloadfile/<collection_name>')
def downloadfile(collection_name):
    try:
        user = request.environ['user']
        if not user or not user['admin']:
            return {"error": "Authentication failed"}, 401
        
        collection = db[collection_name]
        data = list(collection.find({}, {'_id': 0}))
        if not data:
            return jsonify({'error': 'No data found in collection'}), 404
        df = pd.DataFrame(data)
        output = BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name=collection_name)
        
        output.seek(0)

        return send_file(output, as_attachment=True, download_name=f"{collection_name}.xlsx", mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

    except:
        return jsonify({'error': 'Failed to download file'}), 500