from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask application
app = Flask(__name__)
CORS(app)

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

# Registration endpoint
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ['name', 'email', 'password']):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Check if passwords match
    if data.get('password') != data.get('confirmPassword'):
        return jsonify({"error": "Passwords do not match"}), 400
    
    # Check if email is valid format (simple check)
    if '@' not in data['email'] or '.' not in data['email']:
        return jsonify({"error": "Invalid email format"}), 400
    
    # Check if user already exists
    if users_collection.find_one({"email": data['email']}):
        return jsonify({"error": "Email already registered"}), 409
    
    # Create new user
    new_user = {
        "name": data['name'],
        "email": data['email'],
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
            "name": user['name'],
            "email": user['email']
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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)