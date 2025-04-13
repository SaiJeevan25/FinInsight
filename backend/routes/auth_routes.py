from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database import users_collection
from utils.security import hash_password, verify_password
import time
from routes.otp_routes import otp_store

auth_bp = Blueprint('auth', __name__)

# Signup route
@auth_bp.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()

    if not all(k in data for k in ['firstName', 'lastName', 'phone', 'email', 'occupation', 'password']):
        return jsonify({"error": "Missing required fields"}), 400

    if '@' not in data['email'] or '.' not in data['email']:
        return jsonify({"error": "Invalid email format"}), 400

    if users_collection.find_one({"email": data['email']}):
        return jsonify({"error": "Email already registered"}), 409

    new_user = {
        "firstName": data['firstName'],
        "lastName": data['lastName'],
        "email": data['email'],
        "phone": data['phone'],
        "occupation": data['occupation'],
        "password": hash_password(data['password']),
    }

    users_collection.insert_one(new_user)

    access_token = create_access_token(identity=data['email'])

    return jsonify({"message": "User registered successfully", "token": access_token}), 201

# Login route
@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    if not all(k in data for k in ['email', 'password']):
        return jsonify({"error": "Missing email or password"}), 400

    user = users_collection.find_one({"email": data['email']})

    if not user or not verify_password(user['password'], data['password']):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=data['email'])

    return jsonify({"message": "Login successful", "token": access_token, "user": {
        "firstName": user['firstName'],
        "lastName": user['lastName'],
        "email": user['email'],
        "phone": user['phone'],
        "occupation": user['occupation'],
    }}), 200

@auth_bp.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()

    email = data.get('email')
    new_password = data.get('newPassword')  # match frontend key: newPassword
    otp = data.get('otp')

    if not email or not new_password or not otp:
        return jsonify({'error': 'Email, new password, and OTP are required'}), 400

    otp_record = otp_store.get(email)

    if not otp_record:
        return jsonify({'error': 'No OTP found for this email'}), 404

    if time.time() > otp_record['expires']:
        return jsonify({'error': 'OTP has expired'}), 400

    if otp != otp_record['otp']:
        return jsonify({'error': 'Invalid OTP'}), 400

    hashed_password = hash_password(new_password)

    users_collection.update_one(
        {"email": email},
        {"$set": {"password": hashed_password}}
    )

    del otp_store[email]

    return jsonify({'message': 'Password reset successfully'}), 200

