import os
import cv2
import base64
import numpy as np
import random
import string
import time
import hashlib
import hmac
from datetime import datetime
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_socketio import SocketIO
from bson import ObjectId
from deepface import DeepFace
from crypto_utils import encrypt_vote, decrypt_vote
import vonage

# ─────────────────────────────────────────────────────────────────────────────
# CONFIGURATION — edit these values directly
# ─────────────────────────────────────────────────────────────────────────────

MONGO_URI         = 'mongodb://localhost:27017/Face_Guard_Voting_System'

VONAGE_API_KEY    = "83120bcd"
VONAGE_API_SECRET = "0luLvEf8Qb)pYjc7SPyI!7)"
VONAGE_FROM       = "VoteOTP"

USE_GSM_MODEM     = False
GSM_PORT          = "COM3"
GSM_BAUDRATE      = 9600

SUPERVISOR_PIN    = "123456"
SLIP_HASH_SECRET  = "Random_secret_key"

# ─────────────────────────────────────────────────────────────────────────────

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
app.config['MONGO_URI'] = MONGO_URI
mongo = PyMongo(app)

dataset_dir = 'face_dataset'
os.makedirs(dataset_dir, exist_ok=True)

# OTP store — keyed by mobile_number
otp_storage = {}


# ─────────────────────────────────────────────────────────────────────────────
# OTP HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def generate_otp(length=6):
    return ''.join([str(random.randint(0, 9)) for _ in range(length)])


def send_otp(mobile_number: str, otp: str) -> bool:
    if USE_GSM_MODEM:
        return _send_via_gsm(mobile_number, otp)
    return _send_via_vonage(mobile_number, otp)


def _send_via_vonage(mobile_number: str, otp: str) -> bool:
    try:
        client = vonage.Client(key=VONAGE_API_KEY, secret=VONAGE_API_SECRET)
        sms    = vonage.Sms(client)
        responseData = sms.send_message({
            "from": VONAGE_FROM,
            "to":   mobile_number,
            "text": f"Your OTP is {otp}",
        })
        if responseData["messages"][0]["status"] == "0":
            print(f"[Vonage] Message sent successfully to {mobile_number}.")
            return True
        else:
            print(f"[Vonage] Failed: {responseData['messages'][0]['error-text']}")
            return False
    except Exception as e:
        print(f"[Vonage] Exception: {e}")
        return False


def _send_via_gsm(mobile_number: str, otp: str) -> bool:
    try:
        import serial
        with serial.Serial(GSM_PORT, GSM_BAUDRATE, timeout=5) as ser:
            def at(cmd, wait=1):
                ser.write((cmd + "\r\n").encode())
                time.sleep(wait)
                return ser.read(ser.inWaiting()).decode(errors="ignore")
            at("AT")
            at("AT+CMGF=1")
            at(f'AT+CMGS="{mobile_number}"', wait=0.5)
            ser.write((f"Your OTP is {otp}" + chr(26)).encode())
            time.sleep(3)
            return "+CMGS" in ser.read(ser.inWaiting()).decode(errors="ignore")
    except Exception as e:
        print(f"[GSM] {e}")
        return False


def verify_otp(mobile_number: str, entered_otp: str) -> bool:
    if mobile_number in otp_storage and otp_storage[mobile_number] == entered_otp:
        print("OTP verification successful!")
        del otp_storage[mobile_number]
        return True
    print("OTP verification failed!")
    return False


# ─────────────────────────────────────────────────────────────────────────────
# SLIP CODE HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def generate_slip_code() -> str:
    pool = [c for c in string.ascii_uppercase + string.digits if c not in "0O1I"]
    return ''.join(random.SystemRandom().choice(pool) for _ in range(10))


def hash_slip_code(code: str) -> str:
    """Hash the raw code — always strip dashes/spaces before hashing."""
    clean = code.strip().upper().replace('-', '').replace(' ', '')
    return hmac.new(
        SLIP_HASH_SECRET.encode(),
        clean.encode(),
        hashlib.sha256
    ).hexdigest()


# ─────────────────────────────────────────────────────────────────────────────
# UTILITIES
# ─────────────────────────────────────────────────────────────────────────────

def _unlock_voter(voter_id_str: str):
    voter     = mongo.db.voters.find_one({"_id": ObjectId(voter_id_str)})
    region_id = str(voter['regionId']) if voter else ''
    socketio.emit('verifiedVoter', {'voterId': voter_id_str, 'regionId': region_id})


def _audit(event: str, voter_id: str, extra: dict = None):
    doc = {"event": event, "voterId": voter_id, "ts": datetime.utcnow().isoformat()}
    if extra:
        doc.update(extra)
    mongo.db.audit_log.insert_one(doc)


# ─────────────────────────────────────────────────────────────────────────────
# CAPTURE
# ─────────────────────────────────────────────────────────────────────────────

@app.route('/capture', methods=['POST'])
def capture_face():
    data            = request.get_json()
    name            = data['name']
    image_data_list = data['image']
    mobile_number   = data['mobile_number']
    region_id_str   = data['regionId']
    gender          = data.get('gender')
    marital_status  = data.get('maritalStatus')
    dateOfBirth     = data.get('dateOfBirth')
    spouse_name = father_name = mother_name = None

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
    except Exception:
        return jsonify({"error": "Invalid regionId format"}), 400

    plain_code  = generate_slip_code()
    hashed_code = hash_slip_code(plain_code)   # stored as hash of raw 10-char code

    label_dir = os.path.join(dataset_dir, name)
    os.makedirs(label_dir, exist_ok=True)
    count       = len(os.listdir(label_dir))
    upserted_id = None

    for image_data in image_data_list:
        nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
        img   = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        path  = os.path.join(label_dir, f'{count}.jpg')
        cv2.imwrite(path, img)

        res = mongo.db.voters.update_one(
            {'label': name},
            {
                '$setOnInsert': {
                    'hasVoted':         False,
                    'mobile_number':    mobile_number,
                    'regionId':         regionId,
                    'gender':           gender,
                    'maritalStatus':    marital_status,
                    'spouseName':       spouse_name,
                    'fatherName':       father_name,
                    'motherName':       mother_name,
                    'dateOfBirth':      dateOfBirth,
                    'slipCodeHash':     hashed_code,
                    'slipCodeUsed':     False,
                    'slipCodeAttempts': 0,
                    'registeredAt':     datetime.utcnow().isoformat(),
                },
                '$push': {'imagePaths': path}
            },
            upsert=True
        )

        if res.upserted_id:
            upserted_id = res.upserted_id
            mongo.db.regions.update_one(
                {'_id': regionId}, {'$push': {'voters': upserted_id}}, upsert=True
            )
        count += 1

    return jsonify({
        "message":  "Images captured and stored successfully",
        "slipCode": plain_code,      # plain raw code — print immediately, never stored
        "voterId":  str(upserted_id) if upserted_id else None,
    }), 200


# ─────────────────────────────────────────────────────────────────────────────
# SEND OTP
# ─────────────────────────────────────────────────────────────────────────────

@app.route('/send-otp', methods=['POST'])
def send_otp_route():
    data          = request.get_json()
    mobile_number = data.get('mobile', '').strip()

    if not mobile_number:
        return jsonify({"success": False, "message": "Mobile number required"}), 400

    otp = generate_otp()
    otp_storage[mobile_number] = otp
    sms_sent = send_otp(mobile_number, otp)

    if sms_sent:
        return jsonify({"success": True,  "message": "OTP sent successfully"}), 200
    return     jsonify({"success": False, "message": "Failed to send OTP"}), 400


# ─────────────────────────────────────────────────────────────────────────────
# VERIFY OTP
#   Mode 1 — { voterId, otp }  → popup flow, looks up mobile from DB
#   Mode 2 — { mobile,  otp }  → direct mobile lookup
# ─────────────────────────────────────────────────────────────────────────────

@app.route('/verify-otp', methods=['POST'])
def verify_otp_route():
    data         = request.get_json()
    entered_otp  = data.get('otp', '').strip()
    voter_id_str = data.get('voterId', '').strip()
    mobile_input = data.get('mobile', '').strip()

    if voter_id_str:
        voter = mongo.db.voters.find_one({"_id": ObjectId(voter_id_str)})
        if not voter:
            return jsonify({"success": False, "message": "Voter not found"}), 404

        mobile_number = voter.get('mobile_number', '')

        if verify_otp(mobile_number, entered_otp):
            _audit("otp_verified", voter_id_str)
            _unlock_voter(voter_id_str)
            return jsonify({"success": True, "message": "OTP verification successful"}), 200
        else:
            _audit("otp_wrong", voter_id_str)
            return jsonify({"success": False, "message": "OTP verification failed"}), 400

    if mobile_input:
        if verify_otp(mobile_input, entered_otp):
            return jsonify({"success": True,  "message": "OTP verification successful"}), 200
        return     jsonify({"success": False, "message": "OTP verification failed"}), 400

    return jsonify({"success": False, "message": "Provide either voterId or mobile"}), 400


# ─────────────────────────────────────────────────────────────────────────────
# RESEND OTP
# ─────────────────────────────────────────────────────────────────────────────

@app.route('/resend-otp', methods=['POST'])
def resend_otp():
    data         = request.get_json()
    voter_id_str = data.get('voterId', '').strip()

    if not voter_id_str:
        return jsonify({"success": False, "message": "voterId required"}), 400

    voter = mongo.db.voters.find_one({"_id": ObjectId(voter_id_str)})
    if not voter:
        return jsonify({"success": False, "message": "Voter not found"}), 404

    mobile_number = voter.get('mobile_number', '')
    otp           = generate_otp()
    otp_storage[mobile_number] = otp
    sms_sent = send_otp(mobile_number, otp)

    return jsonify({
        "success": True,
        "smsSent": sms_sent,
        "message": "OTP resent successfully" if sms_sent else "OTP generated but SMS failed",
    }), 200


# ─────────────────────────────────────────────────────────────────────────────
# RECOGNIZE
# ─────────────────────────────────────────────────────────────────────────────

@app.route('/recognize', methods=['POST'])
def recognize_face():
    data        = request.get_json()
    image_data  = data.get('image', '')
    region_data = data.get('region', {})

    if not region_data:
        return jsonify({"error": "Missing region details"}), 400

    region_match = mongo.db.regions.find_one({
        "state":    region_data.get("state"),
        "district": region_data.get("district"),
        "zone":     region_data.get("zone"),
        "taluk":    region_data.get("taluk"),
        "wardNo":   region_data.get("wardNo"),
        "pincode":  region_data.get("pincode"),
    })
    if not region_match:
        return jsonify({"error": "Region not found"}), 400

    regionId = region_match["_id"]

    if not image_data:
        return jsonify({"error": "Image data missing"}), 400

    input_path = os.path.join(dataset_dir, 'temp.jpg')
    nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
    img   = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        return jsonify({"error": "Image decoding failed"}), 400
    cv2.imwrite(input_path, img)

    best_match   = None
    min_distance = float('inf')

    for user in mongo.db.voters.find({"regionId": regionId}):
        for saved_path in user.get('imagePaths', []):
            try:
                result = DeepFace.verify(input_path, saved_path, model_name='ArcFace')
                if result['verified'] and result['distance'] < min_distance:
                    min_distance = result['distance']
                    best_match   = user
            except Exception:
                continue

    os.remove(input_path)

    if not best_match:
        return jsonify({"error": "Voter record not found"}), 404

    if best_match.get('hasVoted'):
        return jsonify({"name": best_match['label'], "message": "Already voted"}), 200

    if best_match.get('regionId') != regionId:
        return jsonify({"name": best_match['label'], "message": "Region mismatch"}), 200

    voter         = mongo.db.voters.find_one({"label": best_match['label']})
    voter_id_str  = str(voter['_id'])
    mobile_number = voter.get('mobile_number', '')

    otp      = generate_otp()
    otp_storage[mobile_number] = otp
    sms_sent = send_otp(mobile_number, otp)

    masked = f"XXXXXX{mobile_number[-4:]}" if len(mobile_number) >= 4 else "XXXXXX"
    _audit("face_verified", voter_id_str, {"smsSent": sms_sent})

    socketio.emit('faceVerified', {
        'voterId':     voter_id_str,
        'regionId':    str(regionId),
        'name':        voter['label'],
        'maskedPhone': masked,
        'smsSent':     sms_sent,
    })

    return jsonify({
        "success":      True,
        "name":         voter['label'],
        "voterId":      voter_id_str,
        "regionId":     str(regionId),
        "maskedPhone":  masked,
        "smsSent":      sms_sent,
        "mobileNumber": mobile_number,
        "message":      "Verification successful. OTP sent." if sms_sent else "Face verified. SMS failed — use slip.",
    }), 200


# ─────────────────────────────────────────────────────────────────────────────
# VERIFY SLIP CODE
# ─────────────────────────────────────────────────────────────────────────────

@app.route('/verify-slip', methods=['POST'])
def verify_slip():
    data           = request.get_json()
    voter_id_str   = data.get('voterId', '').strip()
    supervisor_pin = data.get('supervisorPin', '').strip()

    # ── FIX: strip dashes and spaces before hashing ───────────────────────
    # The printed slip shows ABCD-EF-GHIJ for readability but the raw code
    # is ABCDEFGHIJ. Strip formatting so both typed styles work correctly.
    entered_code = data.get('slipCode', '').strip().upper().replace('-', '').replace(' ', '')

    if not all([voter_id_str, supervisor_pin, entered_code]):
        return jsonify({"error": "voterId, supervisorPin and slipCode are all required"}), 400

    if supervisor_pin != SUPERVISOR_PIN:
        _audit("supervisor_pin_wrong", voter_id_str)
        return jsonify({"error": "Invalid supervisor PIN."}), 403

    voter = mongo.db.voters.find_one({"_id": ObjectId(voter_id_str)})
    if not voter:
        return jsonify({"error": "Voter not found"}), 404

    if voter.get('slipCodeUsed'):
        return jsonify({"error": "This slip code has already been used."}), 400

    attempts = voter.get('slipCodeAttempts', 0)
    if attempts >= 3:
        _audit("slip_locked", voter_id_str)
        return jsonify({"error": "Slip code locked. Contact the returning officer."}), 400

    # hash_slip_code also strips dashes internally — double safe
    if not hmac.compare_digest(hash_slip_code(entered_code), voter.get('slipCodeHash', '')):
        mongo.db.voters.update_one({"_id": voter['_id']}, {"$inc": {"slipCodeAttempts": 1}})
        remaining = 3 - (attempts + 1)
        _audit("slip_wrong", voter_id_str, {"remaining": remaining})
        return jsonify({
            "error":     f"Incorrect slip code. {remaining} attempt(s) left.",
            "remaining": remaining,
        }), 400

    mongo.db.voters.update_one(
        {"_id": voter['_id']},
        {"$set": {"slipCodeUsed": True, "slipUsedAt": datetime.utcnow().isoformat()}}
    )
    _audit("slip_verified", voter_id_str, {"supervisorApproved": True})
    _unlock_voter(voter_id_str)
    return jsonify({"success": True, "message": "Slip verified. Voting unlocked."}), 200


# ─────────────────────────────────────────────────────────────────────────────
# CAST VOTE
# ─────────────────────────────────────────────────────────────────────────────

@app.route('/cast-vote', methods=['POST'])
def cast_vote():
    data = request.get_json()
    try:
        voterId = ObjectId(data['voterId'])
        partyId = ObjectId(data['partyId'])
    except Exception:
        return jsonify({"error": "Invalid ID format"}), 400

    voter = mongo.db.voters.find_one({"_id": voterId})
    if not voter or voter.get('hasVoted'):
        return jsonify({"error": "Voter not eligible"}), 400

    mongo.db.votes.insert_one({
        "voterId":       voterId,
        "encryptedVote": encrypt_vote(str(partyId)),
        "regionId":      data.get('regionId'),
    })
    mongo.db.voters.update_one({"_id": voterId}, {"$set": {"hasVoted": True}})
    socketio.emit('lockVoting', {'voterId': str(voterId)})
    return jsonify({"success": True, "message": "Vote cast successfully"}), 200


# ─────────────────────────────────────────────────────────────────────────────
# RESULTS
# ─────────────────────────────────────────────────────────────────────────────

@app.route('/results', methods=['GET'])
def get_results():
    tally = {}
    for v in mongo.db.votes.find():
        try:
            pid = decrypt_vote(v["encryptedVote"])
            tally[pid] = tally.get(pid, 0) + 1
        except Exception:
            pass

    out = []
    for pid, cnt in tally.items():
        p = mongo.db.parties.find_one({"_id": ObjectId(pid)})
        if p:
            out.append({
                "_id":         str(p['_id']),
                "partyName":   p['partyName'],
                "partySymbol": p['partySymbol'],
                "VoteCount":   cnt,
                "regionId":    str(p.get('regionId', '')),
            })
    return jsonify({"parties": out}), 200


# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000)