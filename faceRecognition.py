import os
import cv2
import base64
import numpy as np
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_cors import cross_origin
from flask_socketio import SocketIO, emit
from bson import ObjectId
from deepface import DeepFace
import random
import vonage
from crypto_utils import encrypt_vote
from crypto_utils import decrypt_vote
import json


app = Flask(__name__)
CORS(
    app,
)
socketio = SocketIO(app, cors_allowed_origins="*")  # Initialize SocketIO

app.config['MONGO_URI'] = 'mongodb://localhost:27017/Face_Guard_Voting_System'
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

        result = mongo.db.voters.update_one(
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
    print("=== RAW DATA RECEIVED ===")
    print(data)
    print("==========================")
    image_data = data.get('image', '')
    region_data = data.get('region', {})

    if not region_data:
        print("Region data missing in request")
        return jsonify({"error": "Missing region details"}), 400

    # Try to find matching region in MongoDB
    region_match = mongo.db.regions.find_one({
        "state": region_data.get("state"),
        "district": region_data.get("district"),
        "zone": region_data.get("zone"),
        "taluk": region_data.get("taluk"),
        "wardNo": region_data.get("wardNo"),
        "pincode": region_data.get("pincode")
    })
    print("Region match:", region_match)

    if not region_match:
        print("Region not found in database")
        return jsonify({"error": "Region not found"}), 400

    regionId = region_match["_id"]

    if not image_data:
        print("Image data missing in request")
        return jsonify({"error": "Image data missing"}), 400

    input_path = os.path.join(dataset_dir, 'temp.jpg')
    nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        print("Image decoding failed")
        return jsonify({"error": "Image decoding failed"}), 400
    cv2.imwrite(input_path, img)

    best_match = None
    min_distance = float('inf')

    users = list(mongo.db.voters.find({"regionId": regionId}))  # Filter voters by regionId
    for user in users:
        for saved_path in user['imagePaths']:
            try:
                result = DeepFace.verify(
                    img1_path=input_path,
                    img2_path=saved_path,
                    model_name='ArcFace',
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

        voter = mongo.db.voters.find_one({"label": best_match['label']})
        if voter:
            # Emit verifiedVoter event to unlock voting interface
            socketio.emit('verifiedVoter', {
                'voterId': str(voter['_id']),
                'regionId': str(regionId)
            })
            return jsonify({
                "success": True,
                "message": "Face recognized successfully. Voting interface unlocked.",
                "name": best_match['label'],
                "voterId": str(voter['_id']),
                "regionId": str(regionId)
            }), 200
    else:
        return jsonify({"error": "Voter record not found"}), 404


@app.route('/cast-vote', methods=['POST'])
def cast_vote():
    data = request.get_json()
    voterId = data.get('voterId')
    partyId = data.get('partyId')
    regionId = data.get('regionId')

    if not voterId or not partyId:
        return jsonify({"error": "Voter ID and Party ID required"}), 400

    try:
        voterId = ObjectId(voterId)
        partyId = ObjectId(partyId)
    except:
        return jsonify({"error": "Invalid ID format"}), 400

    voter = mongo.db.voters.find_one({"_id": voterId})
    if not voter or voter.get('hasVoted', False):
        return jsonify({"error": "Voter not eligible"}), 400

    # Encrypt the vote
    encrypted_vote = encrypt_vote(str(partyId))

    # Store the encrypted vote
    mongo.db.votes.insert_one({
        "voterId": voterId,
        "encryptedVote": encrypted_vote,
        "regionId": regionId,
    })

    # Mark voter as voted
    mongo.db.voters.update_one({"_id": voterId}, {"$set": {"hasVoted": True}})

    socketio.emit('lockVoting', {'voterId': str(voterId)})

    return jsonify({"success": True, "message": "Vote cast successfully"}), 200

# ---------------- Get Results ----------------
@app.route('/results', methods=['GET'])
def get_results():
    
    votes = list(mongo.db.votes.find())
    results = {}

    for v in votes:
        try:
            decrypted = decrypt_vote(v["encryptedVote"])
            results[decrypted] = results.get(decrypted, 0) + 1
        except Exception as e:
            print(f"Failed to decrypt vote: {e}")
            continue

    final_results = []
    for partyId, count in results.items():
        party = mongo.db.parties.find_one({"_id": ObjectId(partyId)})
        if party:
            final_results.append({
                "_id": str(party['_id']),
                "partyName": party['partyName'],
                "partySymbol": party['partySymbol'],
                "VoteCount": count,
                "regionId": str(party.get('regionId', ''))
            })

    return jsonify({"parties": final_results}), 200


if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000)