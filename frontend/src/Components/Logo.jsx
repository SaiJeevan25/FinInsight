import React from 'react'
import { useTheme } from './ThemeContext'

export default function Logo() {
    const { darkMode, setDarkMode } = useTheme()

    return (
        <div className='absolute top-4 w-full flex items-center justify-between px-4'>
            {/* Left-aligned Title */}
            <p className="text-md md:text-xl font-extrabold text-indigo-500">
                Fin<span className={`${darkMode ? 'text-gray-400' : "text-gray-700"}`}>Insight</span>
            </p>

            {/* Right-aligned Button */}
            <button
                className={`z-20 px-4 py-2 text-md md:text-lg font-bold cursor-pointer rounded-lg border shadow-sm transition ${darkMode ? 'bg-gray-900 shadow-gray-400 border-gray-400' : 'bg-gray-200 shadow-gray-900 border-gray-900'}`}
                onClick={() => setDarkMode(!darkMode)}
            >
                {darkMode ? 
                    <i className="fa-solid fa-sun"></i> 
                    : 
                    <i className="fa-solid fa-moon"></i>
                }
            </button>
        </div>
    )
}
