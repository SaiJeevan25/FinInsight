from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import users_collection, get_user_transactions_collection
from datetime import datetime


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
@user_bp.route('/api/user/financial-summary', methods=['GET'])
@jwt_required()
def financial_summary():
    current_user_email = get_jwt_identity()
    transactions_collection = get_user_transactions_collection(current_user_email)
    
    # Get period parameter (default to 'all')
    period = request.args.get('period', 'all')
    
    # Create query based on period
    query = {}
    if period == 'month':
        now = datetime.now()
        current_year = now.year
        current_month = now.month
        query = {"date": {"$regex": f"^{current_year}-{current_month:02d}-"}}
    
    transactions = list(transactions_collection.find(query))
    
    # Calculate totals
    total_income = sum(t['amount'] for t in transactions if t['type'] == 'income')
    total_expenses = sum(t['amount'] for t in transactions if t['type'] == 'expense')
    total_savings = total_income - total_expenses
    
    return jsonify({
        "income": f"₹{total_income:,.2f}",
        "expenses": f"₹{total_expenses:,.2f}", 
        "savings": f"₹{total_savings:,.2f}",
        "period": period
    }), 200