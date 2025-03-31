from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.transaction_routes import transaction_bp

app = Flask(__name__)
app.config.from_object(Config)

jwt = JWTManager(app)
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(transaction_bp)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
