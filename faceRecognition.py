import os
import cv2
import base64
import numpy as np
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId
from deepface import DeepFace

app = Flask(__name__)
CORS(app)

app.config['MONGO_URI'] = 'mongodb://localhost:27017/voting_system'
mongo = PyMongo(app)

dataset_dir = 'face_dataset'
os.makedirs(dataset_dir, exist_ok=True)

@app.route('/capture', methods=['POST'])
def capture_face():
    data = request.get_json()
    name = data['name']
    image_data_list = data['image']
    mobile_number = data['mobile_number']
    region_id_str = data['regionId']
    gender = data.get('gender')
    marital_status = data.get('maritalStatus')
    dateOfBirth = data.get('dateOfBirth')

    if marital_status == "married":
        spouse_name = data.get('spouseName')
        if gender == "male" and not spouse_name:
            return jsonify({"error": "Wife's name is required for married males"}), 400
        if gender == "female" and not spouse_name:
            return jsonify({"error": "Husband's name is required for married females"}), 400
    elif marital_status == "unmarried":
        father_name = data.get('fatherName')
        mother_name = data.get('motherName')
        if not father_name or not mother_name:
            return jsonify({"error": "Both father's and mother's names are required if unmarried"}), 400

    try:
        regionId = ObjectId(region_id_str)
    except:
        return jsonify({"error": "Invalid regionId format"}), 400

    label_dir = os.path.join(dataset_dir, name)
    os.makedirs(label_dir, exist_ok=True)

    count = len(os.listdir(label_dir))
    upserted_id_set = False

    for image_data in image_data_list:
        nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        file_path = os.path.join(label_dir, f'{count}.jpg')
        cv2.imwrite(file_path, img)

        result = mongo.db.faces.update_one(
            {'label': name},
            {
                '$setOnInsert': {
                    'hasVoted': False,
                    'mobile_number': mobile_number,
                    'regionId': regionId,
                    'gender': gender,
                    'maritalStatus': marital_status,
                    'spouseName': spouse_name if marital_status == "married" else None,
                    'fatherName': father_name if marital_status == "unmarried" else None,
                    'motherName': mother_name if marital_status == "unmarried" else None,
                    'dateOfBirth': dateOfBirth
                },
                '$push': {'imagePaths': file_path}
            },
            upsert=True
        )

        if result.upserted_id is not None:
            mongo.db.regions.update_one(
                {'_id': regionId},
                {'$push': {'voters': result.upserted_id}},
                upsert=True
            )
            upserted_id_set = True

        count += 1

    return jsonify({"message": "Images captured and stored successfully"}), 200


@app.route('/recognize', methods=['POST'])
def recognize_face():
    data = request.get_json()
    image_data = data.get('image', '')
    region_id_str = data.get('regionId', '')

    try:
        regionId = ObjectId(region_id_str)
    except:
        return jsonify({"error": "Invalid regionId format"}), 400

    # Decode and save input image temporarily
    input_path = os.path.join(dataset_dir, 'temp.jpg')
    nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        return jsonify({"error": "Image decoding failed"}), 400
    cv2.imwrite(input_path, img)

    best_match = None
    min_distance = float('inf')

    users = list(mongo.db.faces.find())
    for user in users:
        for saved_path in user['imagePaths']:
            try:
                result = DeepFace.verify(
                    img1_path=input_path,
                    img2_path=saved_path,
                    model_name='ArcFace',
                    detector_backend='retinaface',
                    enforce_detection=True
                )
                if result['verified'] and result['distance'] < min_distance:
                    min_distance = result['distance']
                    best_match = user
            except:
                continue

    os.remove(input_path)

    if best_match:
        if best_match.get('hasVoted', False):
            return jsonify({"name": best_match['label'], "message": "Already voted"}), 200
        if best_match.get('regionId') != regionId:
            return jsonify({"name": best_match['label'], "message": "Region mismatch"}), 200

        mongo.db.faces.update_one(
            {"label": best_match['label']},
            {"$set": {"hasVoted": True}}
        )

        return jsonify({
            "name": best_match['label'],
            "message": "Verification successful. Vote recorded.",
        }), 200

    return jsonify({"error": "Face not recognized"}), 400


if __name__ == "__main__":
    app.run(debug=True)
