import React from 'react';
import BarAnimation from './Animations/barAnimation';

export default function Login() {
  return (
    <div className="relative bg-gradient-to-br from-blue-400 via-teal-400 to-green-500 h-screen flex items-center justify-center font-poppins">
      {/* Ensure BarAnimation does not block input fields */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <BarAnimation />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-gray-800 bg-opacity-90 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-semibold text-center text-gray-100">Login to Your Account</h2>
        <form action="/login" method="POST" className="mt-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            className="w-full px-4 py-2 mt-2 bg-gray-600 text-white border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          
          <label htmlFor="password" className="block text-sm font-medium text-gray-200 mt-4">Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            className="w-full px-4 py-2 mt-2 bg-gray-600 text-white border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          
          <button 
            type="submit" 
            className="w-full mt-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
          
          <p className="text-center text-white mt-4">Don't have an account? 
            <a href="/signup" className="text-green-500 hover:underline"> Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
