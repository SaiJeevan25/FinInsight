import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../Components/ThemeContext';
import Button from '../Components/Button';
import BarAnimation from '../Components/Animations/BarAnimation';
import Logo from '../Components/Logo';
import BgToggle from '../Components/BgToggle';

export default function ForgotPassword() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error sending OTP');
      setMessage('OTP sent to your email!');
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      window.location.href="#otp-section"
    }
  };

  const handleOtpChange = (e) => {
    // Only allow numbers and limit to 6 digits
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(value);

    // Auto-verify if all 6 digits are entered
    if (value.length === 6) {
      handleVerifyOtp(value);
    }
  };

  const handleVerifyOtp = async (otpValue = otp) => {
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits of the OTP');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpValue })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Invalid OTP');
      setMessage('OTP verified. You can now reset your password.');
      setOtpVerified(true);
      window.location.href="#reset-section";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword, otp })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Password reset failed');
      setMessage('Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative lg:flex-row  min-h-screen flex flex-col justify-center items-center py-5  ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className='absolute z-20 top-4 w-full flex items-center justify-between px-4'>
        <Logo />
        <BgToggle />
      </div>
      <BarAnimation />
      <div className={`p-8 rounded-lg z-20 shadow-lg shadow-indigo-500 w-full max-w-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-2xl font-semibold text-center mb-6">Reset Your Password</h2>

        <div className="space-y-6 ">
          {/* Email Section */}
          <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} transition-all ${otpSent ? 'opacity-70' : ''}`}>
            <h3 className="text-lg font-medium mb-3">Step 1: Verify Your Email</h3>
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                <div className="flex">
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={otpSent}
                    className={`flex-1 p-2 rounded-l-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                  />
                  <Button
                    type="submit"
                    text={loading && !otpSent ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
                    style="rounded-l-none"
                    disabled={loading && !otpSent}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* OTP Section */}
          <div id="otp-section" className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-all ${!otpSent ? 'hidden' : otpVerified ? 'opacity-70' : ''}`}>
            <h3 className="text-lg font-medium mb-3">Step 2: Enter Verification Code</h3>
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                {otpSent ? `Enter 6-digit code sent to ${email}` : 'Complete Step 1 to receive OTP'}
              </label>

              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  disabled={!otpSent || otpVerified}
                  maxLength="6"
                  className={`w-full p-2 text-center text-lg font-medium rounded-l-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500`}
                />
                
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={!otpSent || loading}
                  className={`text-sm ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} hover:underline disabled:opacity-50`}
                >
                  Didn't receive code? Resend
                </button>
              </div>
            </div>
          </div>

          {/* Password Reset Section */}
          <div id="reset-section" className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-all ${!otpVerified ? 'hidden' : ''}`}>
            <h3 className="text-lg font-medium mb-3">Step 3: Create New Password</h3>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={!otpVerified}
                  className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={!otpVerified}
                  className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                />
              </div>
              <Button
                type="submit"
                text={loading && otpVerified ? 'Resetting...' : 'Reset Password'}
                style="w-full"
                disabled={!otpVerified || loading}
              />
            </form>
          </div>
        </div>

        {/* Error or Success Messages */}
        {error && (
          <div className="mt-2 text-center text-red-700 rounded-md">
            {error}
          </div>
        )}
        {message && (
          <div className="mt-2   text-center text-green-500 rounded-md">
            {message}
          </div>
        )}

        {/* Link to Login */}
        <div className="text-center mt-6">
          <p className="text-sm">
            Remembered your password? <a href="/login" className="text-indigo-500 hover:underline font-medium">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
}