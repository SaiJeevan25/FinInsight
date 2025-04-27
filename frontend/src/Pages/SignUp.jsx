import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../Components/ThemeContext';
import BarAnimation from '../Components/Animations/BarAnimation';
import { GoogleLogin } from '@react-oauth/google';
import Logo from '../Components/Logo';
import Button from '../Components/Button';
import BgToggle from '../Components/BgToggle';
import Notification from '../Components/Notification';

export default function SignUp() {
  const { darkMode } = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [otherOccupation, setOtherOccupation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Rest of your code remains the same
  const occupationOptions = [
    "Student",
    "Engineer",
    "Doctor",
    "Teacher",
    "Business Owner",
    "Finance Professional",
    "IT Professional",
    "Freelancer",
    "Retired",
    "Other"
  ];



  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };

  const handleSubmit = async (e) => {
    // Your existing submit handler code
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Debug values
    console.log({
      firstName,
      lastName,
      email,
      phone,
      occupation,
      otherOccupation,
      password,
      confirmPassword
    });

    // Fixed form validation - checking all fields including occupation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword || occupation === "") {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    // Only check otherOccupation if "Other" is selected
    if (occupation === "Other" && !otherOccupation.trim()) {
      setError('Please specify your occupation');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit phone number');
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
      const finalOccupation = occupation === "Other" ? otherOccupation : occupation;

      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          occupation: finalOccupation,
          password,

        }),
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
      setError("Error: ", err);
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
    <div className={`relative min-h-[calc(100vh+1rem)] flex flex-col py-10 md:grid md:grid-cols-2 font-poppins 
      ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'}`}>
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

      {success && (
        <Notification
          type="success"
          message={success}
          onClose={() => setSuccess('')}
        />
      )}
      <div className='hidden md:block absolute w-2xl h-full'>
        <BarAnimation />
      </div>
      <div className="hidden md:flex flex-col justify-center items-center text-center  overflow-hidden">
        <div className={`backdrop-blur-2xl p-8 rounded-2xl shadow-lg shadow-indigo-500 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'}`}>
          <div className="text-center pb-2">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-indigo-500">
              Fin<span className={`${darkMode ? 'text-gray-400' : "text-gray-700"}`}>Insight</span>
            </h1>
            <p className={`mt-2 text-lg md:text-xl text-gray-700 font-light ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              AI-Powered Financial Clarity
            </p>
            <p className='text-xl'>-----</p>
          </div>

          <h1 className="text-2xl font-bold leading-tight">
            "Empower Your Financial Future"
          </h1>
          <p className="mt-4 text-lg max-w-md">
            Unlock powerful insights and tools to help you understand and improve your financial health.
          </p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="relative flex flex-col items-center  justify-center px-3 py-8 md:px-8">
        <div className={`relative w-full max-w-lg p-6 bg-opacity-90 rounded-xl shadow-lg shadow-indigo-500  
          ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'}`}>

          <h2 className="text-2xl font-semibold text-center mb-3">Create an Account</h2>

          <div className="flex flex-col items-center">
            <div className="w-full px-8">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError('Google Login Failed')}
                scope="profile email"
                responseType="token"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-400"></div>
            <span className="px-4 text-sm text-gray-500">OR SIGN UP WITH EMAIL</span>
            <div className="flex-grow h-px bg-gray-400"></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium">First Name:</label>
                <input
                  type="text" id="firstname" name="firstname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-1.5 mt-1 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-medium">Last Name:</label>
                <input
                  type="text" id="lastName" name="lastname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-1.5 mt-1 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
            <div className='mt-2'>
              <label htmlFor="phone" className="block text-sm font-medium">Phone Number:</label>
              <div className='flex gap-1'>
                <p className='w-1/8 px-3 py-1.5 mt-1 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400'>+91</p>
                <input
                  type="tel" id="phone" name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="w-full px-3 py-1.5 mt-1 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <div className="mt-2">
              <label htmlFor="email" className="block text-sm font-medium">Email:</label>
              <input
                type="email" id="email" name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 mt-1 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="mt-2">
              <label htmlFor="occupation" className="block text-sm font-medium">Occupation:</label>
              <select
                id="occupation"
                name="occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-3 py-1.5 mt-1 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400"
              >
                <option value="" disabled>Select your occupation</option>
                {occupationOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {occupation === "Other" && (
              <div className="mt-2">
                <label htmlFor="otherOccupation" className="block text-sm font-medium">Please specify:</label>
                <input
                  type="text"
                  id="otherOccupation"
                  name="otherOccupation"
                  value={otherOccupation}
                  onChange={(e) => setOtherOccupation(e.target.value)}
                  className="w-full px-3 py-1.5 mt-1 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div>
                <label htmlFor="password" className="block text-sm font-medium">Password:</label>
                <input
                  type="password" id="password" name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 mt-1 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password:</label>
                <input
                  type="password" id="confirmPassword" name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-1.5 mt-1 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <Button type='submit' text={loading ? 'Signing Up...' : 'Sign Up'} style="w-full mt-4" disabled={loading} />
            <p className="text-center mt-6 text-md">
              Already have an account? <span></span>
              <a href="/login" className="text-indigo-500 hover:underline">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}