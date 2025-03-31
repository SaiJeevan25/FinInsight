import os
import datetime
from dotenv import load_dotenv

load_dotenv()

class Config:
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(days=1)
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
