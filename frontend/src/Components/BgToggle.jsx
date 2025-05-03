import React from 'react'
import { useTheme } from './ThemeContext'
import { FiSun } from 'react-icons/fi'
import { FiMoon } from 'react-icons/fi'

export default function BgToggle() {
    const { darkMode, setDarkMode } = useTheme()

    return (
        <div>
            <button
                className={`px-3 py-3 text-md md:text-xl font-medium cursor-pointer rounded-2xl  shadow-sm transition ${darkMode ? 'bg-gray-900 shadow-gray-400 border-gray-400' : 'bg-gray-200 shadow-gray-900 border-gray-900'}`}
                onClick={() => setDarkMode(!darkMode)}
            >
                {darkMode ?
                    <FiSun />
                    :
                    <FiMoon />
                }
            </button>
        </div>
    )
}