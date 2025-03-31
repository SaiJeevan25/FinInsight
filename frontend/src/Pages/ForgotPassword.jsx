import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../Components/ThemeContext';
import Button from '../Components/Button';

export default function ForgotPassword() {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset link');
      }
      
      setMessage('Password reset link sent to your email!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`h-screen flex flex-col justify-center items-center p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'}`}>
      <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-2xl font-semibold text-center">Forgot Password</h2>
        <p className="text-center mt-2">Enter your email to receive a reset link.</p>

        <form onSubmit={handleResetRequest} className="mt-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 bg-gray-600 text-white rounded-md"
          />

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          {message && <p className="text-green-500 text-center mt-2">{message}</p>}

          <Button type="submit" text={loading ? 'Sending...' : 'Send Reset Link'} style="w-full mt-4" disabled={loading} />
        </form>

        <p className="text-center mt-4">
          Remembered your password? <a href="/login" className="text-indigo-500 hover:underline">Log In</a>
        </p>
      </div>
    </div>
  );
}
