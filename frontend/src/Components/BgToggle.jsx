import React from 'react'
import { useTheme } from './ThemeContext'

export default function BgToggle() {
    const { darkMode, setDarkMode } = useTheme()

    return (
        <div>
            <button
                className={`px-4 py-2 text-md md:text-lg font-bold cursor-pointer rounded-lg border shadow-sm transition ${darkMode ? 'bg-gray-900 shadow-gray-400 border-gray-400' : 'bg-gray-200 shadow-gray-900 border-gray-900'}`}
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
