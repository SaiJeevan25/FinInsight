from flask import Blueprint, request, jsonify
import os
import smtplib
import random
import time
from utils.security import hash_password, verify_password
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


otp_blueprint = Blueprint('otp_blueprint', __name__)
otp_store = {}
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
    otp_store[email] = {'otp': otp, 'expires': time.time() + 300}
    html_content = f"""
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Dear user,</p>
    <p>Your <strong>One-Time Password (OTP)</strong> for the password reset is:</p>
    <h2 style="color: #6366F1; background-color: #f1f1f1; display: inline-block; padding: 10px 15px; border-radius: 5px;">{otp}</h2>
    <p>This code is valid for <strong>5 minutes</strong>.</p>
    <p>If you did not request this, please ignore this email.</p>
    <br>
    <p>Best regards,<br><strong>FinInsight Team</strong></p>
  </body>
</html>
"""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Password Reset OTP"
    msg["From"] = SENDER_EMAIL
    msg["To"] = email
    msg.attach(MIMEText(html_content, "html"))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, email, msg.as_string())

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
