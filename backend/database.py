from pymongo import MongoClient
from config import Config
import re

client = MongoClient(
    Config.MONGO_URI,
    tls=True,
    tlsAllowInvalidCertificates=False,
    serverSelectionTimeoutMS=5000
)

db = client["fininsight_db"]
users_collection = db["users_auth"]

def init_indexes():
    """
    Initialize DB indexes.
    Must be called AFTER app startup.
    """
    users_collection.create_index("email", unique=True)

def get_user_transactions_collection(email):
    """Get or create a transactions collection for a specific user"""
    collection_name = re.sub(r"[^a-zA-Z0-9_]", "_", email)
    return db[collection_name]
