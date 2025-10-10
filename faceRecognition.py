# import os
# import cv2
# import base64
# import numpy as np
# from flask import Flask, request, jsonify
# from flask_pymongo import PyMongo
# from flask_cors import CORS
# from bson import ObjectId
# from deepface import DeepFace
# import random
# import vonage

# app = Flask(__name__)
# CORS(app)

# app.config['MONGO_URI'] = 'mongodb://localhost:27017/Face_Guard_Voting_System'
# mongo = PyMongo(app)

# dataset_dir = 'face_dataset'
# os.makedirs(dataset_dir, exist_ok=True)

# otp_storage = {}

# def generate_otp(length=6):
#     """Generate a random OTP of specified length."""
#     return ''.join([str(random.randint(0, 9)) for _ in range(length)])

# def send_otp(mobile_number, otp):
#     """Send OTP to a mobile number using Nexmo (Vonage API)."""
#     client = vonage.Client(key="83120bcd", secret="vZD55Pmf6eszc^*BD1I7624m")
#     sms = vonage.Sms(client)
    
#     responseData = sms.send_message({
#         "from": "Vonage APIs",
#         "to": mobile_number,
#         'text': f'Your OTP is {otp}',
#     })

#     if responseData["messages"][0]["status"] == "0":
#         print(f"Message sent successfully to {mobile_number}.")
#     else:
#         print(f"Message failed with error: {responseData['messages'][0]['error-text']}")

# def verify_otp(mobile_number, entered_otp):
#     if mobile_number in otp_storage and otp_storage[mobile_number] == entered_otp:
#         print("OTP verification successful!")
#         del otp_storage[mobile_number]
#         return True
#     else:
#         print("OTP verification failed!")
#         return False

# # # @app.route('/verify-otp', methods=['POST'])
# # # def verify_otp_route():
# #     data = request.get_json()
# #     print("=== RAW DATA RECEIVED FOR OTP VERIFICATION ===")
# #     print(data)
# #     print("=============================================")
# #     mobile_number = data.get('mobileNumber')
# #     entered_otp = data.get('otp')
# #     print("Verifying OTP for mobile number:", mobile_number)
# #     print("Entered OTP:", entered_otp)

# #     if not mobile_number or not entered_otp:
# #         print("Mobile number or OTP missing in request")
# #         return jsonify({"error": "Mobile number and OTP are required"}), 400

# #     # ✅ Verify OTP
# #     if verify_otp(mobile_number, entered_otp):
# #         # ✅ Retrieve voter info
# #         best_match = otp_storage.pop(f"{mobile_number}_voter", None)
# #         if not best_match:
# #             print("Voter session expired or not found")
# #             return jsonify({"error": "Voter session expired"}), 400

# #         # ✅ Mark the voter as voted
# #         mongo.db.voters.update_one(
# #             {"label": best_match['label']},
# #             {"$set": {"hasVoted": True}}
# #         )

# #         return jsonify({
# #             "success": True,
# #             "message": "OTP verified successfully. Vote recorded.",
# #             "name": best_match['label']
# #         }), 200

# #     return jsonify({"success": False, "message": "Invalid OTP"}), 400

    
# @app.route('/capture', methods=['POST'])
# def capture_face():
#     data = request.get_json()
#     name = data['name']
#     image_data_list = data['image']
#     mobile_number = data['mobile_number']
#     region_id_str = data['regionId']
#     gender = data.get('gender')
#     marital_status = data.get('maritalStatus')
#     dateOfBirth = data.get('dateOfBirth')

#     if marital_status == "married":
#         spouse_name = data.get('spouseName')
#         if gender == "male" and not spouse_name:
#             return jsonify({"error": "Wife's name is required for married males"}), 400
#         if gender == "female" and not spouse_name:
#             return jsonify({"error": "Husband's name is required for married females"}), 400
#     elif marital_status == "unmarried":
#         father_name = data.get('fatherName')
#         mother_name = data.get('motherName')
#         if not father_name or not mother_name:
#             return jsonify({"error": "Both father's and mother's names are required if unmarried"}), 400

#     try:
#         regionId = ObjectId(region_id_str)
#     except:
#         return jsonify({"error": "Invalid regionId format"}), 400

#     label_dir = os.path.join(dataset_dir, name)
#     os.makedirs(label_dir, exist_ok=True)

#     count = len(os.listdir(label_dir))
#     upserted_id_set = False

#     for image_data in image_data_list:
#         nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
#         img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#         file_path = os.path.join(label_dir, f'{count}.jpg')
#         cv2.imwrite(file_path, img)

#         result = mongo.db.voters.update_one(
#             {'label': name},
#             {
#                 '$setOnInsert': {
#                     'hasVoted': False,
#                     'mobile_number': mobile_number,
#                     'regionId': regionId,
#                     'gender': gender,
#                     'maritalStatus': marital_status,
#                     'spouseName': spouse_name if marital_status == "married" else None,
#                     'fatherName': father_name if marital_status == "unmarried" else None,
#                     'motherName': mother_name if marital_status == "unmarried" else None,
#                     'dateOfBirth': dateOfBirth
#                 },
#                 '$push': {'imagePaths': file_path}
#             },
#             upsert=True
#         )

#         if result.upserted_id is not None:
#             mongo.db.regions.update_one(
#                 {'_id': regionId},
#                 {'$push': {'voters': result.upserted_id}},
#                 upsert=True
#             )
#             upserted_id_set = True

#         count += 1

#     return jsonify({"message": "Images captured and stored successfully"}), 200

# # @app.route('/recognize', methods=['POST'])
# # def recognize_face():
# #     data = request.get_json()
# #     print("=== RAW DATA RECEIVED ===")
# #     print(data)
# #     print("==========================")
# #     image_data = data.get('image', '')
# #     region_data = data.get('region', {})



# #     if not region_data:
# #         print("Region data missing in request")
# #         return jsonify({"error": "Missing region details"}), 400

# #     # 3️⃣ Try to find matching region in MongoDB
# #     region_match = mongo.db.regions.find_one({
# #         "state": region_data.get("state"),
# #         "district": region_data.get("district"),
# #         "zone": region_data.get("zone"),
# #         "taluk": region_data.get("taluk"),
# #         "wardNo": region_data.get("wardNo"),
# #         "pincode": region_data.get("pincode")
# #     })
# #     print("Region match:", region_match)

# #     # 4️⃣ Return error if not found
# #     if not region_match:
# #         print("Region not found in database")
# #         return jsonify({"error": "Region not found"}), 400

# #     # 5️⃣ Extract regionId for next operations
# #     regionId = region_match["_id"]


# #     # 6️⃣ Get the image data
# #     image_base64 = data.get('image', '')
# #     if not image_base64:
# #         print("Image data missing in request")
# #         return jsonify({"error": "Image data missing"}), 400


# #     input_path = os.path.join(dataset_dir, 'temp.jpg')
# #     nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
# #     img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
# #     if img is None:
# #         print("Image decoding failed")
# #         return jsonify({"error": "Image decoding failed"}), 400
# #     cv2.imwrite(input_path, img)

# #     best_match = None
# #     min_distance = float('inf')

# #     users = list(mongo.db.voters.find())
# #     for user in users:
# #         for saved_path in user['imagePaths']:
# #             try:
# #                 result = DeepFace.verify(
# #                     img1_path=input_path,
# #                     img2_path=saved_path,
# #                     model_name='ArcFace',
# #                     # detector_backend='retinaface',
# #                     # enforce_detection=True
# #                 )
# #                 if result['verified'] and result['distance'] < min_distance:
# #                     min_distance = result['distance']
# #                     best_match = user
# #             except:
# #                 continue

# #     os.remove(input_path)

# #     if best_match:
# #         if best_match.get('hasVoted', False):
# #             return jsonify({"name": best_match['label'], "message": "Already voted"}), 200
# #         if best_match.get('regionId') != regionId:
# #             return jsonify({"name": best_match['label'], "message": "Region mismatch"}), 200

# #         voter = mongo.db.voters.find_one({"label": best_match['label']})

# #         if voter:
# #            mobile_number = voter.get("mobile_number")
# #            otp = generate_otp()
# #            otp_storage[mobile_number] = otp
# #            otp_storage[f"{mobile_number}_voter"] = best_match  # store voter session
# #            send_otp(mobile_number, otp)
    
# #         return jsonify({
# #         "success": True,
# #         "message": "Face recognized successfully. OTP sent.",
# #         "name": best_match['label'],
# #         "mobileNumber": mobile_number
# #          }), 200
# #     else:
# #         return jsonify({"error": "Voter record not found"}), 404
# # ... (other imports remain the same)

# @app.route('/recognize', methods=['POST'])
# def recognize_face():
#     data = request.get_json()
#     print("=== RAW DATA RECEIVED ===")
#     print(data)
#     print("==========================")
#     image_data = data.get('image', '')
#     region_data = data.get('region', {})

#     if not region_data:
#         print("Region data missing in request")
#         return jsonify({"error": "Missing region details"}), 400

#     # 3️⃣ Try to find matching region in MongoDB
#     region_match = mongo.db.regions.find_one({
#         "state": region_data.get("state"),
#         "district": region_data.get("district"),
#         "zone": region_data.get("zone"),
#         "taluk": region_data.get("taluk"),
#         "wardNo": region_data.get("wardNo"),
#         "pincode": region_data.get("pincode")
#     })
#     print("Region match:", region_match)

#     # 4️⃣ Return error if not found
#     if not region_match:
#         print("Region not found in database")
#         return jsonify({"error": "Region not found"}), 400

#     # 5️⃣ Extract regionId for next operations
#     regionId = region_match["_id"]

#     # 6️⃣ Get the image data
#     image_base64 = data.get('image', '')
#     if not image_base64:
#         print("Image data missing in request")
#         return jsonify({"error": "Image data missing"}), 400

#     input_path = os.path.join(dataset_dir, 'temp.jpg')
#     nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
#     img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#     if img is None:
#         print("Image decoding failed")
#         return jsonify({"error": "Image decoding failed"}), 400
#     cv2.imwrite(input_path, img)

#     best_match = None
#     min_distance = float('inf')

#     users = list(mongo.db.voters.find({"regionId": regionId}))  # Filter voters by regionId
#     for user in users:
#         for saved_path in user['imagePaths']:
#             try:
#                 result = DeepFace.verify(
#                     img1_path=input_path,
#                     img2_path=saved_path,
#                     model_name='ArcFace',
#                 )
#                 if result['verified'] and result['distance'] < min_distance:
#                     min_distance = result['distance']
#                     best_match = user
#             except:
#                 continue

#     os.remove(input_path)

#     if best_match:
#         if best_match.get('hasVoted', False):
#             return jsonify({"name": best_match['label'], "message": "Already voted"}), 200
#         if best_match.get('regionId') != regionId:
#             return jsonify({"name": best_match['label'], "message": "Region mismatch"}), 200

#         voter = mongo.db.voters.find_one({"label": best_match['label']})

#         if voter:
#             mobile_number = voter.get("mobile_number")
#             otp = generate_otp()
#             otp_storage[mobile_number] = otp
#             otp_storage[f"{mobile_number}_voter"] = best_match  # store voter session
#             send_otp(mobile_number, otp)

#             return jsonify({
#                 "success": True,
#                 "message": "Face recognized successfully. OTP sent.",
#                 "name": best_match['label'],
#                 "mobileNumber": mobile_number,
#                 "regionId": str(regionId),  # Return regionId as string
#                 "voterId": str(voter['_id'])  # Return voterId
#             }), 200
#     else:
#         return jsonify({"error": "Voter record not found"}), 404

# @app.route('/verify-otp', methods=['POST'])
# def verify_otp_route():
#     data = request.get_json()
#     print("=== RAW DATA RECEIVED FOR OTP VERIFICATION ===")
#     print(data)
#     print("=============================================")
#     mobile_number = data.get('mobileNumber')
#     entered_otp = data.get('otp')
#     print("Verifying OTP for mobile number:", mobile_number)
#     print("Entered OTP:", entered_otp)

#     if not mobile_number or not entered_otp:
#         print("Mobile number or OTP missing in request")
#         return jsonify({"error": "Mobile number and OTP are required"}), 400

#     # ✅ Verify OTP
#     if verify_otp(mobile_number, entered_otp):
#         # ✅ Retrieve voter info
#         best_match = otp_storage.pop(f"{mobile_number}_voter", None)
#         if not best_match:
#             print("Voter session expired or not found")
#             return jsonify({"error": "Voter session expired"}), 400

#         # ✅ Mark the voter as voted
#         mongo.db.voters.update_one(
#             {"label": best_match['label']},
#             {"$set": {"hasVoted": True}}
#         )

#         return jsonify({
#             "success": True,
#             "message": "OTP verified successfully. Vote recorded.",
#             "name": best_match['label'],
#             "voterId": str(best_match['_id'])  # Return voterId
#         }), 200

#     return jsonify({"success": False, "message": "Invalid OTP"}), 400


# if __name__ == "__main__":
#     app.run(debug=True)


import os
import cv2
import base64
import numpy as np
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from bson import ObjectId
from deepface import DeepFace
import random
import vonage

app = Flask(__name__)
CORS(app)
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

    if not voterId or not partyId:
        return jsonify({"error": "Voter ID and Party ID are required"}), 400

    try:
        voterId = ObjectId(voterId)
        partyId = ObjectId(partyId)
    except:
        return jsonify({"error": "Invalid Voter ID or Party ID format"}), 400

    voter = mongo.db.voters.find_one({"_id": voterId})
    if not voter:
        return jsonify({"error": "Voter not found"}), 404

    if voter.get('hasVoted', False):
        return jsonify({"error": "Voter has already voted"}), 400

    # Update voter to mark as voted
    mongo.db.voters.update_one(
        {"_id": voterId},
        {"$set": {"hasVoted": True}}
    )

    # Record the vote (e.g., increment vote count for the party)
    mongo.db.parties.update_one(
        {"_id": partyId},
        {"$inc": {"voteCount": 1}}
    )

    # Emit lockVoting event
    socketio.emit('lockVoting', {'voterId': str(voterId)})

    return jsonify({
        "success": True,
        "message": "Vote cast successfully"
    }), 200

if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000)