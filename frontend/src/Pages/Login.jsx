import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../Components/ThemeContext';
import BarAnimation from '../Components/Animations/BarAnimation';
import RupeeCoinAnimation from '../Components/Animations/RupeeCoinAnimation';
import Logo from '../Components/Logo';
import Button from '../Components/Button';
import BgToggle from '../Components/BgToggle';
import Notification from '../Components/Notification';

export default function Login() {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/google-callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };


  return (
    <div className={`h-screen flex flex-col md:grid md:grid-cols-2 font-poppins
      ${darkMode
        ? 'bg-black text-white'
        : 'bg-gradient-to-br from-white via-gray-300 to-indigo-200 text-gray-900'
      }`}>
      <div className='absolute z-20 top-4 w-full flex items-center justify-between px-4'>
        <Logo />
        <BgToggle />
      </div>
      {error && (
        <Notification
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      <div className='hidden md:block absolute w-2xl h-full'>
        <BarAnimation />
      </div>

      <div className="hidden md:flex flex-col justify-center items-center text-center p-12 overflow-hidden">
        <div className={`backdrop-blur-2xl p-6 rounded-2xl shadow-lg shadow-indigo-500 border-b-2 
          ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold ">
            <span className={`bg-clip-text text-transparent ${darkMode ? 'bg-gradient-to-r from-indigo-400 to-indigo-500' : 'bg-gradient-to-r from-indigo-600 to-indigo-400'
              }`}>
              Fin
            </span>
            <span className={darkMode ? 'text-gray-200' : 'text-gray-900'}>
              Insight
            </span>
          </h1>
          <p className={`mt-4 text-lg md:text-2xl text-gray-700 font-light 
            ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Financial Clarity Application
          </p>
          <p className='text-2xl'>-----</p>
            <RupeeCoinAnimation />
          <h1 className="text-2xl font-bold leading-tight">
            "Welcome Back"
          </h1>
          <p className="mt-4 text-lg max-w-md">
            Log in to access your personalized financial insights!
          </p>
        </div>
      </div>

      <div className="relative h-screen flex flex-col items-center shadow justify-center px-4 md:px-8">
        <div className={`relative w-full max-w-md p-8 bg-opacity-90 rounded-xl shadow-lg shadow-indigo-500
          ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'}`}>

          <h2 className="text-3xl font-semibold text-center mb-7">Log In to Your Account</h2>

          <div className="flex flex-col items-center">
            <div className="w-full hover:bg-black/40 rounded-lg z-50 hover:shadow-md shadow-gray-300 duration-200">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError('Google Login Failed')}
                scope="profile email"
                responseType="token"
              />
            </div>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-400"></div>
            <span className="px-4 text-sm text-gray-500">OR LOGIN WITH EMAIL</span>
            <div className="flex-grow h-px bg-gray-400"></div>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="block text-sm font-medium">Email:</label>
            <input
              type="email" id="email" name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400"
            />

            <label htmlFor="password" className="block text-sm font-medium mt-4">Password:</label>
            <input
              type="password" id="password" name="password" required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400"
            />
            <Button type="submit" text={loading ? 'Logging in...' : 'Log In'} style="w-full mt-3" disabled={loading} />

            <p className="text-center mt-4">
              <a href="/forgot-password" className="text-indigo-500 hover:underline">Forgot Password ?</a>
            </p>
            <p className="text-center mt-2">
              Don't have an account?<span> </span>
              <a href="/signup" className="text-indigo-500 hover:underline">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}