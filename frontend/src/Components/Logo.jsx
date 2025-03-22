import React from 'react'
import { useTheme } from './ThemeContext'

export default function () {
    const { darkMode } = useTheme();
    return (
        <div>
            <button onClick={() => windows.location.href = "/"} className='border-none'>
                <p className="text-md md:text-xl font-extrabold text-indigo-500 cursor-pointer">
                    Fin<span className={`${darkMode ? 'text-gray-400' : "text-gray-700"}`}>Insight</span>
                </p>
            </button>
        </div>
    )
}
