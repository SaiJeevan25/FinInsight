import React from 'react';
import { FiPieChart, FiBarChart2, FiZap, FiTrendingUp } from "react-icons/fi";

export default function DashboardViewToggle({ activeView, setActiveView, darkMode }) {
  const views = [
    { id: 'summary', label: 'Summary', icon: <FiBarChart2 className="mr-2" /> },
    { id: 'breakdown', label: 'Breakdown', icon: <FiPieChart className="mr-2" /> },
    { id: 'trends', label: 'Trends', icon: <FiTrendingUp className="mr-2" /> },
    { id: 'insights', label: 'AI Insights', icon: <FiZap className="mr-2" /> }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-6 w-full">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => setActiveView(view.id)}
          className={`flex items-center duration-300 shadow-sm shadow-black px-4 py-2 rounded-lg transition-all ${
            activeView === view.id
              ? 'bg-indigo-600 text-white shadow-md'
              : darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {view.icon}
          <span>{view.label}</span>
        </button>
      ))}
    </div>
  );
}