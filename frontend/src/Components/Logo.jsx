import React from 'react'
import { useTheme } from './ThemeContext'

export default function () {
    const { darkMode } = useTheme();
    return (
        <div>
            <button onClick={() => windows.location.href = "/"} className='border-none text-md md:text-2xl font-extrabold'>
                <p className=" cursor-pointer">
                <span className={`bg-clip-text text-transparent ${
                  darkMode ? 'bg-gradient-to-r from-indigo-400 to-indigo-500' : 'bg-gradient-to-r from-indigo-600 to-indigo-400'
                }`}>
                  Fin
                </span>
                <span className={darkMode ? 'text-gray-200' : 'text-gray-900'}>
                  Insight
                </span>
                </p>
            </button>
        </div>  
    )
}