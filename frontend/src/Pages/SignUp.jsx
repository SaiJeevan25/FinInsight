import React from 'react';
import { useTheme } from '../Components/ThemeContext';
import BarAnimation from '../Components/Animations/barAnimation';
import Logo from '../Components/Logo';
import Button from '../Components/Button';

export default function SignUp() {
  const { darkMode } = useTheme();

  return (
    <div className={`h-screen flex flex-col md:grid md:grid-cols-2 font-poppins
      ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'}`}>
      <Logo />

      <div className="hidden md:flex flex-col justify-center items-center text-center p-12 overflow-hidden">
        <BarAnimation />
        <div className={`backdrop-blur-2xl  p-6 rounded-2xl shadow-lg shadow-indigo-500 border-b-2  ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'}`}>
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
      <div className="relative flex flex-col items-center h-screen mt-10 md:mt-0  shadow justify-center px-2 md:px-8 ">


        <div className={`relative w-full max-w-md p-8 bg-opacity-90 rounded-xl shadow-lg shadow-indigo-500
          ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'}`}>
          <h2 className="text-3xl font-semibold text-center">Create an Account</h2>
          <form action="/signup" method="POST" className="mt-6">
            <label htmlFor="name" className="block text-sm font-medium">Full Name:</label>
            <input
              type="text" id="name" name="name" required
              className="w-full px-4 py-2 mt-2 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400"
            />

            <label htmlFor="email" className="block text-sm font-medium mt-4">Email:</label>
            <input
              type="email" id="email" name="email" required
              className="w-full px-4 py-2 mt-2 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400"
            />

            <label htmlFor="password" className="block text-sm font-medium mt-4">Password:</label>
            <input
              type="password" id="password" name="password" required
              className="w-full px-4 py-2 mt-2 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400"
            />

            <label htmlFor="confirmPassword" className="block text-sm font-medium mt-4">Confirm Password:</label>
            <input
              type="password" id="confirmPassword" name="confirmPassword" required
              className="w-full px-4 py-2 mt-2 bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-400"
            />

            <Button func={() => (null)} text='Sign Up' style="w-full mt-8" />

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
