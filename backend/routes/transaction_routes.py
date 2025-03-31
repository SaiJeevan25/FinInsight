from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import get_user_transactions_collection
import datetime

transaction_bp = Blueprint('transactions', __name__)

@transaction_bp.route('/api/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    current_user_email = get_jwt_identity()
    transactions_collection = get_user_transactions_collection(current_user_email)

    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)
    day = request.args.get('day', type=int)

    if not year:
        return jsonify({"error": "Year is required"}), 400

    date_query = {"date": {"$regex": f"^{year}-{month:02d}-{day:02d}" if day else f"^{year}-{month:02d}-" if month else f"^{year}-"}}
    
    transactions = list(transactions_collection.find(date_query, {"_id": 0}))

    return jsonify(transactions), 200

@transaction_bp.route('/api/transactions', methods=['POST'])
@jwt_required()
def add_transaction():
    current_user_email = get_jwt_identity()
    transactions_collection = get_user_transactions_collection(current_user_email)
    data = request.get_json()

    required_fields = ['title', 'amount', 'category', 'type', 'date']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing transaction fields"}), 400

    transaction = {
        "title": data['title'],
        "amount": float(data['amount']),
        "category": data['category'],
        "type": data['type'],
        "date": data['date'],
        "created_at": datetime.datetime.now()
    }

    transactions_collection.insert_one(transaction)

    return jsonify({"message": "Transaction saved successfully"}), 201
