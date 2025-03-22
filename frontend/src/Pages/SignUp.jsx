import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../Components/ThemeContext';
import BarAnimation from '../Components/Animations/barAnimation';
import Logo from '../Components/Logo';
import Button from '../Components/Button';
import BgToggle from '../Components/BgToggle';

export default function SignUp() {
  const { darkMode } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    // Form validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      // Store token
      localStorage.setItem('token', data.token);
      
      setSuccess('Account created successfully! Redirecting...');
      
      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative h-full md:h-screen flex flex-col md:grid md:grid-cols-2 font-poppins
      ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'}`}>
      <div className='absolute z-20 top-4 w-full flex items-center justify-between px-4'>
        <Logo />
        <BgToggle />
      </div>
      <div className='hidden md:block absolute w-2xl h-full'>
        <BarAnimation />
      </div>
      <div className="hidden md:flex flex-col justify-center items-center text-center p-12 overflow-hidden">
        <div className={`backdrop-blur-2xl p-6 rounded-2xl shadow-lg shadow-indigo-500 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'}`}>
          <div className="text-center pb-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-indigo-500">
              Fin<span className={`${darkMode ? 'text-gray-400' : "text-gray-700"}`}>Insight</span>
            </h1>
            <p className={`mt-4 text-lg md:text-2xl text-gray-700 font-light ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              AI-Powered Financial Clarity
            </p>
            <p className='text-2xl'>-----</p>
          </div>

          <h1 className="text-2xl font-bold leading-tight">
            "Your Journey Starts Here"
          </h1>
          <p className="mt-4 text-lg max-w-md">
            Build. Learn. Achieve. Join us today and unlock exclusive features tailored just for you!
          </p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="relative flex flex-col items-center h-screen mt-10 md:mt-0 shadow justify-center px-3 pt-10 md:px-8">
        <div className={`relative w-full max-w-md p-8 bg-opacity-90 rounded-xl shadow-lg shadow-indigo-500
          ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'}`}>
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          {success && <div className="text-center text-green-500 mb-4">{success}</div>}
          <h2 className="text-3xl font-semibold text-center">Create an Account</h2>
          <form onSubmit={handleSubmit} className="mt-6">
            <label htmlFor="name" className="block text-sm font-medium">Full Name:</label>
            <input
              type="text" id="name" name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400"
            />

            <label htmlFor="email" className="block text-sm font-medium mt-4">Email:</label>
            <input
              type="email" id="email" name="email" required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400"
            />

            <label htmlFor="password" className="block text-sm font-medium mt-4">Password:</label>
            <input
              type="password" id="password" name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400"
            />

            <label htmlFor="confirmPassword" className="block text-sm font-medium mt-4">Confirm Password:</label>
            <input
              type="password" id="confirmPassword" name="confirmPassword" required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400"
            />

            <Button type='submit' text={loading ? 'Signing Up...' : 'Sign Up'} style="w-full mt-8" disabled={loading} />

            <p className="text-center mt-4">
              Already have an account?
              <a href="/login" className="text-indigo-500 hover:underline"> Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}