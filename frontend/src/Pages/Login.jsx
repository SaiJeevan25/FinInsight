import React from 'react';
import { useTheme } from '../Components/ThemeContext';
import BarAnimation from '../Components/Animations/barAnimation';
import Logo from '../Components/Logo';
import Button from '../Components/Button';

export default function Login() {
  const { darkMode, setDarkMode } = useTheme();
  return (
    <div className={`relative h-screen flex items-center justify-center font-poppins 
  ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'
        : 'bg-gradient-to-br from-gray-200 via-gray-300 to-white text-black'}`}>
          <Logo />
      {/* Background Animation */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">

        <BarAnimation />
      </div>

      <div className={`relative z-10  w-full max-w-md p-8  bg-opacity-90 rounded-xl shadow-2xl ${darkMode ? 'bg-gray-400 text-gray-900' : 'bg-gray-800 text-gray-300'}`}>
        <h2 className="text-3xl font-semibold text-center">Login to Your Account</h2>
        <form action="/login" method="POST" className="mt-6">
          <label htmlFor="email" className="block text-sm font-medium">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-2 mt-2 bg-gray-600 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <label htmlFor="password" className="block text-sm font-medium  mt-4">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-4 py-2 mt-2 bg-gray-600 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <Button func={() => (null)} text='Login' style="w-full mt-8 " />

          <p className="text-center mt-4">Don't have an account?
            <a href="/signup" className="text-indigo-500 hover:underline"> Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
