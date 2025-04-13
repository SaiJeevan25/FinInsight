# otp_routes.py

from flask import Blueprint, request, jsonify
import os
import smtplib
import random
import time
from utils.security import hash_password, verify_password

otp_blueprint = Blueprint('otp_blueprint', __name__)

# Simple in-memory store (use DB or Redis in production)
otp_store = {}

# SMTP Config
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

@otp_blueprint.route('/api/auth/forgot-password', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    otp = str(random.randint(100000, 999999))
    otp_store[email] = {'otp': otp, 'expires': time.time() + 300}  # 5 minutes validity

    message = f"Subject: Your OTP Code\n\nYour OTP is: {otp}. It is valid for 5 minutes."

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, email, message)

        return jsonify({'message': 'OTP sent successfully'}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to send OTP: {str(e)}'}), 500


@otp_blueprint.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    user_otp = data.get('otp')

    record = otp_store.get(email)

    if not record:
        return jsonify({'error': 'No OTP found for this email'}), 404

    if time.time() > record['expires']:
        return jsonify({'error': 'OTP has expired'}), 400

    if user_otp == record['otp']:
        return jsonify({'message': 'OTP verified'}), 200

    return jsonify({'error': 'Invalid OTP'}), 400
