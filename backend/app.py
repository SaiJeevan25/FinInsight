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
    
# @app.route('/api/stats', methods=['POST', 'OPTIONS'])
# @jwt_required(optional=True)  # Make JWT optional for OPTIONS
# def get_stats():
#     if request.method == 'OPTIONS':
#         return jsonify({}), 200
    
#     current_user_email = get_jwt_identity()
#     transactions_collection = get_user_transactions_collection(current_user_email)
#     data = request.get_json()
    
#     # Validate input
#     if not all(k in data for k in ['month', 'year']):
#         return jsonify({"error": "Month and year are required"}), 400
    
#     month = data['month']
#     year = data['year']
#     time_range = data.get('timeRange', 'month')
    
#     # Date range calculation
#     def get_date_range(m, y, trange):
#         if trange == 'month':
#             start = datetime.datetime(y, m, 1)
#             end = datetime.datetime(y, m + 1, 1) if m < 12 else datetime.datetime(y + 1, 1, 1)
#         elif trange == 'quarter':
#             quarter_start_month = ((m - 1) // 3) * 3 + 1
#             start = datetime.datetime(y, quarter_start_month, 1)
#             end = datetime.datetime(y, quarter_start_month + 3, 1) if quarter_start_month < 10 else datetime.datetime(y + 1, 1, 1)
#         else:  # year
#             start = datetime.datetime(y, 1, 1)
#             end = datetime.datetime(y + 1, 1, 1)
#         return start, end
    
#     # Current period transactions
#     current_start, current_end = get_date_range(month, year, time_range)
#     current_transactions = list(transactions_collection.find({
#         "date": {
#             "$gte": current_start.strftime("%Y-%m-%d"),
#             "$lt": current_end.strftime("%Y-%m-%d")
#         }
#     }))
    
#     # Calculate totals
#     income = sum(t['amount'] for t in current_transactions if t['type'] == 'income')
#     expenses = sum(t['amount'] for t in current_transactions if t['type'] == 'expense')
#     savings = income - expenses
#     savings_rate = round((savings / income * 100), 1) if income > 0 else 0
    
#     # Category breakdown
#     expense_categories = defaultdict(float)
#     for t in current_transactions:
#         if t['type'] == 'expense':
#             expense_categories[t['category']] += t['amount']
    
#     total_expenses = sum(expense_categories.values())
#     category_breakdown = [
#         {
#             "category": cat,
#             "amount": amount,
#             "percentage": round((amount / total_expenses * 100), 1) if total_expenses > 0 else 0,
#             "icon": get_category_icon(cat)
#         }
#         for cat, amount in expense_categories.items()
#     ]
    
#     # Trends calculation
#     prev_start, prev_end = get_date_range(
#         month - 1 if month > 1 else 12,
#         year if month > 1 else year - 1,
#         time_range
#     )
    
#     prev_transactions = list(transactions_collection.find({
#         "date": {
#             "$gte": prev_start.strftime("%Y-%m-%d"),
#             "$lt": prev_end.strftime("%Y-%m-%d")
#         }
#     }))
    
#     prev_income = sum(t['amount'] for t in prev_transactions if t['type'] == 'income')
#     prev_expenses = sum(t['amount'] for t in prev_transactions if t['type'] == 'expense')
#     prev_savings = prev_income - prev_expenses
    
#     def calculate_change(current, previous):
#         return round(((current - previous) / previous * 100), 1) if previous != 0 else 0
    
#     trends = {
#         "incomeChangePercentage": calculate_change(income, prev_income),
#         "expenseChangePercentage": calculate_change(expenses, prev_expenses),
#         "savingsChangePercentage": calculate_change(savings, prev_savings)
#     }
    
#     # Monthly data for charts
#     monthly_data = {
#         "income": [],
#         "expenses": [],
#         "savings": []
#     }
    
#     for i in range(3, -1, -1):  # Last 4 months including current
#         m = month - i
#         y = year
#         if m < 1:
#             m += 12
#             y -= 1
        
#         month_start = datetime.datetime(y, m, 1)
#         month_end = datetime.datetime(y, m + 1, 1) if m < 12 else datetime.datetime(y + 1, 1, 1)
        
#         month_trans = list(transactions_collection.find({
#             "date": {
#                 "$gte": month_start.strftime("%Y-%m-%d"),
#                 "$lt": month_end.strftime("%Y-%m-%d")
#             }
#         }))
        
#         monthly_data["income"].append(sum(t['amount'] for t in month_trans if t['type'] == 'income'))
#         monthly_data["expenses"].append(sum(t['amount'] for t in month_trans if t['type'] == 'expense'))
#         monthly_data["savings"].append(monthly_data["income"][-1] - monthly_data["expenses"][-1])
    
#     # Structure response to match frontend expectations
#     response = {
#         "summary": {
#             "income": income,
#             "expenses": expenses,
#             "savings": savings,
#             "savingsRate": savings_rate
#         },
#         "trends": trends,
#         "categoryBreakdown": category_breakdown,
#         "monthlyData": monthly_data
#     }
    
#     return jsonify(response), 200

# # Helper function to get icon name for category
# def get_category_icon(category):
#     category = category.lower()
#     if 'food' in category or 'grocer' in category:
#         return "FiCoffee"
#     elif 'rent' in category or 'mortgage' in category:
#         return "FiHome"
#     elif 'shopping' in category or 'retail' in category:
#         return "FiShoppingBag"
#     elif 'transport' in category or 'car' in category or 'gas' in category:
#         return "FiTruck"
#     elif 'utility' in category or 'electric' in category or 'water' in category:
#         return "FiMonitor"
#     elif 'entertain' in category or 'movie' in category:
#         return "FiFilm"
#     elif 'health' in category or 'medical' in category:
#         return "FiHeart"
#     else:
#         return "FiDollarSign"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)  