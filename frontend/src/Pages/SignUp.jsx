import React from "react";
import { Link } from "react-router-dom";
import BarAnimation from "../Animations/barAnimation";
import ThemeToggleButton from "../Components/ThemeToggleButton";
import { useTheme } from "../context/ThemeContext";

export default function SignUp() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div className={`relative flex items-center justify-center min-h-screen px-6 duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      
      <ThemeToggleButton />
      <BarAnimation/>

      <div className={`relative z-10 w-full max-w-md p-8 rounded-lg shadow-lg backdrop-blur-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className="text-3xl font-bold text-center text-indigo-500">Sign Up</h2>
        <p className="text-center text-gray-500">Create your account</p>

        <form className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold">Full Name</label>
            <input type="text" className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-indigo-300" placeholder="Enter your name" required />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold">Email</label>
            <input type="email" className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-indigo-300" placeholder="Enter your email" required />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold">Password</label>
            <input type="password" className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-indigo-300" placeholder="Enter your password" required />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold">Confirm Password</label>
            <input type="password" className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-indigo-300" placeholder="Confirm your password" required />
          </div>
          <button type="submit" className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 transition">
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-indigo-500 hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}
