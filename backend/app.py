from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.transaction_routes import transaction_bp
from routes.stats_routes import stats_bp
from routes.otp_routes import otp_blueprint

from database import init_indexes  # ✅ IMPORTANT

from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

# Configure CORS
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

# ✅ Create MongoDB indexes AFTER app starts
@app.before_first_request
def setup_database():
    init_indexes()

# ✅ Render-compatible port
PORT = int(os.environ.get("PORT", 10000))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT)
