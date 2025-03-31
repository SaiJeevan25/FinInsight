from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from database import users_collection
from utils.security import hash_password, verify_password

auth_bp = Blueprint('auth', __name__)

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
