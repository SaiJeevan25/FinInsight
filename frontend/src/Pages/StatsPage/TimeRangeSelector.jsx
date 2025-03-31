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
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
      {/* Time Range Buttons */}
      <div className="flex space-x-4 w-full sm:w-auto">
        {["month", "quarter", "year"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-2 cursor-pointer duration-300 shadow-sm shadow-black rounded-lg capitalize flex-1 sm:flex-none text-sm ${
              timeRange === range
                ? `bg-indigo-500 text-white`
                : `${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`
            }`}
          >
            {range}
          </button>
        ))}
      </div>
      
      {/* Month/Period Selector */}
      <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
        <button 
          onClick={handlePrevMonth}
          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          aria-label="Previous period"
        >
          <FiChevronLeft className="text-xl" />
        </button>
        
        <div className="flex items-center min-w-24 justify-center">
          <FiCalendar className="mr-2 text-indigo-500" />
          <span className="font-semibold text-sm sm:text-base">{getTimeRangeText()}</span>
        </div>
        
        <button 
          onClick={handleNextMonth}
          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          aria-label="Next period"
        >
          <FiChevronRight className="text-xl" />
        </button>
      </div>
    </div>
  );
}