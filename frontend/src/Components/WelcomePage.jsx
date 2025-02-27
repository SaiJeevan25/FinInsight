import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BarAnimation from "./Animations/BarAnimation";


export default function WelcomePage() {

  const [darkMode, setDarkMode] = useState(false);


  return (
    <div className={`relative flex flex-col lg:flex-row justify-center items-center h-screen overflow-hidden duration-300 px-6 ${darkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>

      <button
        className={`absolute z-20 top-2 right-2 md:top-6 md:right-6 px-4 py-2 text-lg font-bold cursor-pointer rounded-lg shadow-sm transition duration-150 ${darkMode ? 'hover:shadow-md bg-gray-900 shadow-gray-400 ' : 'hover:shadow-md bg-gray-200 shadow-gray-900 '}`}
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ?
          <i className="fa-solid fa-sun "> </i>
          :

          <i className="fa-solid fa-moon capitalize"> </i>}
      </button>

      <BarAnimation darkMode={darkMode} />

      <div className={`flex flex-col gap-10 items-center justify-center backdrop-blur-md p-6 rounded-xl bg-gray-100 shadow-xl ${darkMode ? 'bg-gray-800 text-white shadow-gray-600' : 'bg-white shadow-black text-gray-900'}`}>
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-indigo-500">
            FinInsight
          </h1>
          <p className={`mt-4 text-lg md:text-2xl text-gray-700 font-light ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            AI-Powered Financial Clarity
          </p>
        </div>
        <p className={`text-lg text-center text-gray-700 max-w-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          FinInsight uses AI to categorize expenses from bank statements and receipts. Track spending trends with interactive charts and personalized insights. Securely access reports across devices for smarter budgeting.
        </p>
        <div>
          <p className="flex flex-col justify-center items-center text-2xl text-indigo-500 font-extrabold">Get Started For Free</p>
         <div className="flex py-6 gap-4">
              <Link 
                to="/login" 
                className="border-2 shadow-md hover:shadow-none shadow-indigo-500 px-6 py-3 text-lg md:text-xl cursor-pointer rounded-xl font-extrabold text-indigo-500 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white transition"
              >
                Log In
              </Link>

              <Link 
                to="/signup" 
                className="border-2 shadow-md hover:shadow-none shadow-indigo-500  px-6 py-3 text-lg md:text-xl cursor-pointer rounded-xl font-extrabold text-indigo-500 hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition"
              >
                Sign Up
              </Link>
         </div>
        </div>
      </div>
    </div>
  );
}
