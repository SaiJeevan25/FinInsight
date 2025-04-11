from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import get_user_transactions_collection
import datetime
from bson import ObjectId

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

    # Construct the regex for the date based on available filters
    if day:
        date_pattern = f"^{year}-{month:02d}-{day:02d}"
    elif month:
        date_pattern = f"^{year}-{month:02d}-"
    else:
        date_pattern = f"^{year}-"

    date_query = {"date": {"$regex": date_pattern}}

    transactions = list(transactions_collection.find(date_query))

    # Convert ObjectId to string and rename as 'id'
    for transaction in transactions:
        transaction["id"] = str(transaction["_id"])
        del transaction["_id"]

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

    result = transactions_collection.insert_one(transaction)
    transaction["id"] = str(result.inserted_id)

    return jsonify({"message": "Transaction saved successfully", "transaction": transaction}), 201

@transaction_bp.route('/api/transactions/<transaction_id>', methods=['PUT'])
@jwt_required()
def update_transaction(transaction_id):
    current_user_email = get_jwt_identity()
    transactions_collection = get_user_transactions_collection(current_user_email)
    data = request.get_json()

    required_fields = ['title', 'amount', 'category', 'type', 'date']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing transaction fields"}), 400

    try:
        # Create update data
        update_data = {
            "title": data['title'],
            "amount": float(data['amount']),
            "category": data['category'],
            "type": data['type'],
            "date": data['date'],
            "updated_at": datetime.datetime.now()
        }

        # Update the transaction
        result = transactions_collection.update_one(
            {"_id": ObjectId(transaction_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Transaction not found"}), 404

        # Get the updated transaction
        updated_transaction = transactions_collection.find_one({"_id": ObjectId(transaction_id)})
        if updated_transaction:
            updated_transaction["id"] = str(updated_transaction["_id"])
            del updated_transaction["_id"]
        
        return jsonify({
            "message": "Transaction updated successfully",
            "transaction": updated_transaction
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@transaction_bp.route('/api/transactions/<transaction_id>', methods=['DELETE'])
@jwt_required()
def delete_transaction(transaction_id):
    current_user_email = get_jwt_identity()
    transactions_collection = get_user_transactions_collection(current_user_email)
    
    try:
        # Delete the transaction
        result = transactions_collection.delete_one({"_id": ObjectId(transaction_id)})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Transaction not found"}), 404
            
        return jsonify({"message": "Transaction deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500