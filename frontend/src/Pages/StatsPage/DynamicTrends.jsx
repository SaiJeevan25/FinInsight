import React, { useState } from 'react';
import { FiTrendingUp, FiPieChart } from 'react-icons/fi';
import LineChartComponent from './LineChartComponent';
import PieChartComponent from './PieChartComponent';

export default function DynamicTrends({
  darkMode,
  incomeBreakdown = [],
  categoryBreakdown = [],
  monthlyData,
  timeRange
}) {
  const [activeTab, setActiveTab] = useState('trends'); // 'trends' or 'breakdown'
  const [breakdownType, setBreakdownType] = useState('income'); // 'income' or 'expense'

  return (
    <div className={`p-4 flex-1 flex flex-col md:flex-row gap-5 justify-evenly  ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg`}>
      {/* Main Toggle Buttons */}
      <div className="flex md:flex-col flex-row md:mt-20 gap-4 mb-6">
        <button
          onClick={() => setActiveTab('trends')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full cursor-pointer shadow-xs text-sm font-medium transition-all ${activeTab === 'trends'
              ? `${darkMode ? 'bg-indigo-600 text-white shadow-none' : 'bg-indigo-500 text-white shadow-none'}`
              : `${darkMode ? 'bg-gray-700 text-gray-300 shadow-black' : 'bg-gray-200 text-gray-700 shadow-black'}`
            }`}
        >
          <FiTrendingUp className="text-lg" />
          Trends Overview
        </button>
        <button
          onClick={() => {
            setActiveTab('breakdown');
            setBreakdownType('income'); // Default to income when switching
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-xs cursor-pointer  text-sm font-medium transition-all ${activeTab === 'breakdown'
              ? `${darkMode ? 'bg-indigo-600 text-white shadow-none' : 'bg-indigo-500 text-white  shadow-md'}`
              : `${darkMode ? 'bg-gray-700 text-gray-300 shadow-black' : 'bg-gray-200 text-gray-700 shadow-black'}`
            }`}
        >
          <FiPieChart className="text-lg" />
          Financial Breakdown
        </button>
      </div>
      <div>
        {/* Breakdown Type Selector (shown only when breakdown tab is active) */}
        {activeTab === 'breakdown' && (
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setBreakdownType('income')}
              className={`flex items-center gap-2 px-4 py-2 shadow-black rounded-full text-xs font-medium transition-all ${breakdownType === 'income'
                  ? `${darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white shadow-md'}`
                  : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                }`}
            >
              Income Sources
            </button>
            <button
              onClick={() => setBreakdownType('expense')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-black text-xs font-medium transition-all ${breakdownType === 'expense'
                  ? `${darkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white shadow-md'}`
                  : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                }`}
            >
              Expense Categories
            </button>
          </div>
        )}

        {/* Chart Display */}
        <div className={`p-6 rounded-xl md:w-[60rem] ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          {activeTab === 'trends' ? (
            monthlyData?.income?.length > 0 ? (
              <LineChartComponent
                data={monthlyData}
                timeRange={timeRange}
                darkMode={darkMode}
              />
            ) : (
              <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No trend data available
              </div>
            )
          ) : (
            breakdownType === 'income' ? (
              <PieChartComponent
                data={incomeBreakdown}
                title="Income Sources"
                darkMode={darkMode}
                colorScheme="green"
              />
            ) : (
              <PieChartComponent
                data={categoryBreakdown}
                title="Expense Categories"
                darkMode={darkMode}
                colorScheme="red"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}