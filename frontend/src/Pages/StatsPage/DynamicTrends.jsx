import React from 'react';
import { FiBarChart2 } from "react-icons/fi";

export default function DynamicTrends({ monthlyData, timeRange, darkMode }) {
  // Get the appropriate title based on the time range
  const getTrendTitle = () => {
    switch(timeRange) {
      case "month":
        return "Monthly Trends";
      case "quarter":
        return "Quarterly Trends";
      case "year":
        return "Yearly Trends";
      default:
        return "Monthly Trends";
    }
  };

  // Get the appropriate labels based on the time range
  const getLabels = () => {
    switch(timeRange) {
      case "month":
        return "daily breakdown";
      case "quarter":
        return "monthly breakdown";
      case "year":
        return "quarterly breakdown";
      default:
        return "monthly breakdown";
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md col-span-1 lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">{getTrendTitle()}</h3>
        <FiBarChart2 className="text-indigo-500" />
      </div>
      
      <div className="flex justify-center mt-8 space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span className="text-sm">Income</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
          <span className="text-sm">Expenses</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span className="text-sm">Savings</span>
        </div>
      </div>
      
      {/* Note: In a real app, you'd render an actual chart here using libraries like recharts */}
      <div className="text-center text-sm text-gray-500 mt-6">
        Chart would show {getLabels()} for the selected {timeRange}
      </div>
    </div>
  );
}