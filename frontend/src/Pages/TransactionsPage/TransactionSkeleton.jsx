import React from "react"
import { useTheme } from "../../Components/ThemeContext"
export default function TransactionSkeleton() {
    const {darkMode} = useTheme();
    
    return (<div className="space-y-3">
        {[1, 2, 3].map((item) => (
            <div
                key={item}
                className={`p-4 rounded-lg shadow-md animate-pulse
            ${darkMode ? 'bg-gray-800' : 'bg-white'}
            border-l-4 ${item % 2 === 0 ? 'border-blue-500' : 'border-red-500'}`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                        <div>
                            <div className={`h-4 w-24 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                            <div className={`h-3 w-32 rounded mt-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className={`h-6 w-16 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                        <div className={`h-6 w-16 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    </div>
                </div>
            </div>
        ))}
    </div>)
};