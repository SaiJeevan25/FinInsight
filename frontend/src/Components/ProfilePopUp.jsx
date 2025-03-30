import React from "react";
import { useTheme } from "./ThemeContext";

export default function ProfilePopUp({ message, setMessage }) {
  const { darkMode } = useTheme();

  return (
    <>
      {/* Backdrop overlay that covers the entire screen */}
      <div 
        className="fixed inset-0  bg-opacity-50 backdrop-blur-sm z-40"
        onClick={() => setMessage("")}
      ></div>
      
      <div 
        className={`
          fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col justify-center items-center border border-indigo-500 shadow-lg ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"} p-6 rounded-md max-w-md w-full mx-4
        `}>
        <p className="text-center text-lg">{message}</p>
        <button 
          onClick={() => setMessage("")} 
          className={`
            text-center cursor-pointer w-24 py-2 rounded-md border-2 border-indigo-500 hover:bg-indigo-500 hover:text-white transition-colors duration-200
            ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"} mt-4
          `}
        >
          Close
        </button>
      </div>
    </>
  );
}