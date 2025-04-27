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
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP</title>
    <style>
      body {{
        font-family: 'Poppins', sans-serif;
        line-height: 1.6;
        background-color: #000000;
        color: #333;
        margin: 0;
        padding: 20px;
      }}
      .container {{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 70vh;
        padding: 20px;
      }}
      .email-content {{
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        width: 100%;
        text-align: center;
      }}
      span{{
        color: #4a4a4a;
      }}
      .header {{
        font-size: 24px;
        font-weight: bold;
        color: #6366F1;
      }}
      .otp-container {{
        color: #6366F1;
        padding: 2px;
        border-radius: 5px;
        display: inline-block;
        font-size: 22px;
        font-weight: bold;
      }}
      .footer {{
        font-size: 16px;
        color: #555;
      }}

    </style>
  </head>
  <body>
    <div class="container">
      <div class="email-content">
        <p class="header">Fin<span>Insight</span></p>
        <p>Dear User,</p>
        <p>Your <strong>One-Time Password (OTP)</strong> for the password reset is:</p>
        <div class="otp-container">
          <p>{otp}</p>
        </div>
        <p>This code is valid for <strong>5 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
        <br>
        <p class="footer">Best regards,<br><strong>FinInsight Team</strong></p>
      </div>
    </div>
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
