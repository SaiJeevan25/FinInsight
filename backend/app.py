from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
import os
import re  # Added missing import
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask application
app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "expose_headers": ["Content-Type"]
    }
})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.add('Access-Control-Expose-Headers', 'Content-Type')
    return response


# Configure JWT
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
jwt = JWTManager(app)

# Connect to MongoDB
client = MongoClient(os.environ.get('MONGO_URI', 'mongodb://localhost:27017/'))
db = client['fininsight_db']
users_collection = db['users_auth']

# Create unique index for email
users_collection.create_index('email', unique=True)

def get_user_transactions_collection(email):
    """Get or create a transactions collection for a specific user"""
    # Sanitize email to create a valid collection name
    collection_name = re.sub(r'[^a-zA-Z0-9_]', '_', email)
    return db[collection_name]
# Registration endpoint
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ['firstName','lastName','phone', 'email','occupation', 'password']):
        return jsonify({"error": "Missing required fields"}), 400
    
    
    # Check if email is valid format (simple check)
    if '@' not in data['email'] or '.' not in data['email']:
        return jsonify({"error": "Invalid email format"}), 400
    
    # Check if user already exists
    if users_collection.find_one({"email": data['email']}):
        return jsonify({"error": "Email already registered"}), 409
    
    # Create new user
    new_user = {
        "firstName": data['firstName'],
        "lastName": data['lastName'],
        "email": data['email'],
        "phone": data['phone'],
        "occupation": data['occupation'],
        "password": generate_password_hash(data['password']),
        "created_at": datetime.datetime.now()
    }
    
    try:
        users_collection.insert_one(new_user)
        
        # Create access token
        access_token = create_access_token(identity=data['email'])
        
        return jsonify({
            "message": "User registered successfully",
            "token": access_token
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Login endpoint
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ['email', 'password']):
        return jsonify({"error": "Missing email or password"}), 400
    
    # Find user by email
    user = users_collection.find_one({"email": data['email']})
    
    # Check if user exists and password is correct
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({"error": "Invalid email or password"}), 401
    
    # Create access token
    access_token = create_access_token(identity=data['email'])
    
    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": {
            "fistName": user['firstName'],
            "lastName": user['lastName'],
            "email": user['email'],
            "phone": user['phone'],
            "occupation": user['occupation'],
            "created_at": user['created_at'].strftime("%Y-%m-%d %H:%M:%S"),
        }
    }), 200

# Protected route example
@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def profile():
    # Get the user's email from the JWT
    current_user_email = get_jwt_identity()
    
    # Find user in database
    user = users_collection.find_one({"email": current_user_email}, 
                                    {"_id": 0, "password": 0})  # Exclude sensitive fields
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(user), 200

# ✅ Update User Profile (Protected)
@app.route('/api/user/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_email = get_jwt_identity()
    data = request.get_json()

    update_data = {}

    if "firstName" in data:
        update_data["firstName"] = data["firstName"]
    if "lastName" in data:
        update_data["lastName"] = data["lastName"]
    if "phone" in data:
        update_data["phone"] = data["phone"]
    if "occupation" in data:
        update_data["occupation"] = data["occupation"]

    if not update_data:
        return jsonify({"error": "No data to update"}), 400

    result = users_collection.update_one({"email": current_user_email}, {"$set": update_data})

    if result.modified_count == 0:
        return jsonify({"error": "No changes made"}), 400

    return jsonify({"message": "Profile updated successfully"}), 200

@app.route('/api/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    try:
        current_user_email = get_jwt_identity()
        transactions_collection = get_user_transactions_collection(current_user_email)
        
        # Get and validate parameters
        day = request.args.get('day', type=int)
        month = request.args.get('month', type=int)
        year = request.args.get('year', type=int)
        
        if not year:
            return jsonify({"error": "Year is required"}), 400
        
        # Build date query
        date_query = {}
        try:
            if day and month:
                date_query["date"] = {"$regex": f"^{year}-{month:02d}-{day:02d}"}
            elif month:
                date_query["date"] = {"$regex": f"^{year}-{month:02d}-"}
            else:
                date_query["date"] = {"$regex": f"^{year}-"}
        except Exception as e:
            return jsonify({"error": f"Invalid date parameters: {str(e)}"}), 400
        
        # Execute query
        transactions_cursor = transactions_collection.find(date_query, {"_id": 0})
        
        # Convert cursor to list and handle potential decoding errors
        try:
            transactions = list(transactions_cursor)
        except Exception as e:
            return jsonify({"error": f"Error decoding transactions: {str(e)}"}), 500
        
        return jsonify(transactions), 200
        
    except Exception as e:
        app.logger.error(f"Error in get_transactions: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500

@app.route('/api/transactions', methods=['POST'])
@jwt_required()
def add_transaction():
    current_user_email = get_jwt_identity()
    transactions_collection = get_user_transactions_collection(current_user_email)
    data = request.get_json()

    required_fields = ['title', 'amount', 'category', 'type', 'date']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing transaction fields"}), 400

    try:
        transaction = {
            "title": data['title'],
            "amount": float(data['amount']),
            "category": data['category'],
            "type": data['type'],
            "date": data['date'],  # Expected format: YYYY-MM-DD
            "created_at": datetime.datetime.now()
        }

        transactions_collection.insert_one(transaction)
        return jsonify({"message": "Transaction saved successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)  