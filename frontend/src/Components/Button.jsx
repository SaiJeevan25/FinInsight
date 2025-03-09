import React from 'react'
import { useTheme } from './ThemeContext'

export default function Button(props) {
  const {text, func} = props
  const { darkMode } = useTheme()
  return (
    <button onClick={func} className={`px-8 mx-auto py-4 rounded-md border-[2px] indigoShadow font-extrabold border-indigo-600 duration-200 ${darkMode ? 'bg-gray-800': 'bg-gray-200'}`}>
        <p>{text}</p>
    </button>
  )
}