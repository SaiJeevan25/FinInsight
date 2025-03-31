import React from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function TimeRangeSelector({
  timeRange,
  setTimeRange,
  currentMonthIndex,
  currentYear,
  handlePrevMonth,
  handleNextMonth,
  getTimeRangeText,
  darkMode
}) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex space-x-2">
        {["month", "quarter", "year"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 cursor-pointer rounded-lg capitalize ${
              timeRange === range
                ? `bg-indigo-500 text-white`
                : `${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`
            }`}
          >
            {range}
          </button>
        ))}
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={handlePrevMonth}
          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <FiChevronLeft className="text-xl" />
        </button>
        
        <div className="flex items-center">
          <FiCalendar className="mr-2 text-indigo-500" />
          <span className="font-semibold">{getTimeRangeText()}</span>
        </div>
        
        <button 
          onClick={handleNextMonth}
          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <FiChevronRight className="text-xl" />
        </button>
      </div>
    </div>
  );
}