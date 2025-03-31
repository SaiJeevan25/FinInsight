from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import users_collection

user_bp = Blueprint('user', __name__)

@user_bp.route('/api/user/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_user_email}, {"_id": 0, "password": 0})

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user), 200

@user_bp.route('/api/user/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_email = get_jwt_identity()
    data = request.get_json()
    
    update_data = {k: v for k, v in data.items() if k in ["firstName", "lastName", "phone", "occupation"]}

    if not update_data:
        return jsonify({"error": "No data to update"}), 400

    result = users_collection.update_one({"email": current_user_email}, {"$set": update_data})

    if result.modified_count == 0:
        return jsonify({"error": "No changes made"}), 400

    return jsonify({"message": "Profile updated successfully"}), 200
