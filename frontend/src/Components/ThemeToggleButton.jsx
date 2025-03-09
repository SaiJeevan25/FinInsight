import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggleButton() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <button
      className={`absolute z-20 top-2 right-2 md:top-6 md:right-6 px-4 py-2 text-lg font-bold cursor-pointer rounded-lg shadow-sm transition duration-150 ${
        darkMode
          ? "hover:shadow-md bg-gray-900 shadow-gray-400 text-white"
          : "hover:shadow-md bg-gray-200 shadow-gray-900 text-black"
      }`}
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
    </button>
  );
}
