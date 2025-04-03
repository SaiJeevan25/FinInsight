import React, { useState } from 'react';
import { FiDollarSign, FiCreditCard } from 'react-icons/fi';
import PieChartComponent from './PieChartComponent';

export default function DynamicTrends({ 
  darkMode,
  incomeBreakdown = [], 
  categoryBreakdown = [] 
}) {
  const [activeTab, setActiveTab] = useState('income');

  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg`}>
      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('income')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
            activeTab === 'income'
              ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white shadow-md'}`
              : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
          }`}
        >
          <FiDollarSign className="text-lg" />
          Income
        </button>
        <button
          onClick={() => setActiveTab('expense')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
            activeTab === 'expense'
              ? `${darkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white shadow-md'}`
              : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
          }`}
        >
          <FiCreditCard className="text-lg" />
          Expenses
        </button>
      </div>

      {/* Pie Chart Display */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        {activeTab === 'income' ? (
          <PieChartComponent 
            data={incomeBreakdown} 
            title="Income Sources" 
            darkMode={darkMode}
            colorScheme="blue"
          />
        ) : (
          <PieChartComponent 
            data={categoryBreakdown} 
            title="Expense Categories" 
            darkMode={darkMode}
            colorScheme="red"
          />
        )}
      </div>
    </div>
  );
}