import React from 'react';
import { FiPieChart, FiTrendingUp, FiZap } from "react-icons/fi";

export default function DashboardViewToggle({ activeView, setActiveView, darkMode }) {
  const views = [
    { id: 'breakdown', label: 'Breakdown', icon: <FiPieChart className="mr-2" /> },
    { id: 'trends', label: 'Trends', icon: <FiTrendingUp className="mr-2" /> },
    { id: 'insights', label: 'AI Insights', icon: <FiZap className="mr-2" /> }
  ];

  return (
    <div className={`inline-block shadow font-bold text-sm md:text-md rounded-xl p-2  ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-200 border border-gray-200'
    }`}>
      <div className="flex gap-3 duration-150">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
              activeView === view.id
                ? darkMode
                  ? 'bg-gray-300 text-indigo-600 font-medium shadow-sm ring-1 ring-indigo-500'
                  : 'bg-white text-indigo-600 font-medium shadow-sm ring-1 ring-indigo-300'
                : darkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-gray-300' 
                  : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className={`${activeView === view.id ? (darkMode ? 'text-indigo-600' : 'text-indigo-500') : ''}`}>
              {view.icon}
            </span>
            <span>{view.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}