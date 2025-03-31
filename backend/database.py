from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URI)
db = client['fininsight_db']
users_collection = db['users_auth']

# Ensure unique index for emails
users_collection.create_index('email', unique=True)

def get_user_transactions_collection(email):
    """Get or create a transactions collection for a specific user"""
    import re
    collection_name = re.sub(r'[^a-zA-Z0-9_]', '_', email)
    return db[collection_name]
