from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.transaction_routes import transaction_bp
from routes.stats_routes import stats_bp 
from routes.otp_routes import otp_blueprint

from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

# Configure CORS properly
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    },
    supports_credentials=True
)

jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(transaction_bp)
app.register_blueprint(stats_bp)
app.register_blueprint(otp_blueprint)

# ✅ Get port from .env (fallback to 5000)
PORT = int(os.getenv("PORT", 5000))

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=PORT)
