import React from "react";
import { useTheme } from "./ThemeContext";

export default function ProfilePopUp({ message, setMessage }) {
  const { darkMode } = useTheme();

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={() => setMessage("")}>

      <div
        className={`
          fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col justify-center items-center shadow-lg shadow-black ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"} p-6 rounded-md max-w-md w-full mx-4
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
    </div>
  );
}