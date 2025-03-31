import React from 'react';
import { FiArrowUp, FiArrowDown, FiTrendingUp, FiTrendingDown, FiDollarSign, FiPieChart } from "react-icons/fi";

// Helper to format currency
const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export default function SummaryCards({ summary, trends, darkMode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Income Card */}
      <div className={`p-6 rounded-lg shadow-md shadow-black ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">Total Income</p>
            <h2 className="text-2xl font-bold mt-1">{formatCurrency(summary.income)}</h2>
          </div>
          <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
            <FiArrowDown className="text-xl" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {trends.incomeChange >= 0 ? (
            <>
              <FiTrendingUp className="text-green-500 mr-1" />
              <span className="text-green-500 text-sm">+{trends.incomeChange}%</span>
            </>
          ) : (
            <>
              <FiTrendingDown className="text-red-500 mr-1" />
              <span className="text-red-500 text-sm">{trends.incomeChange}%</span>
            </>
          )}
          <span className="text-gray-500 text-sm ml-1">from last period</span>
        </div>
      </div>

      {/* Expenses Card */}
      <div className={`p-6 rounded-lg shadow-md shadow-black ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">Total Expenses</p>
            <h2 className="text-2xl font-bold mt-1">{formatCurrency(summary.expenses)}</h2>
          </div>
          <div className={`p-3 rounded-full ${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600'}`}>
            <FiArrowUp className="text-xl" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {trends.expenseChange <= 0 ? (
            <>
              <FiTrendingDown className="text-green-500 mr-1" />
              <span className="text-green-500 text-sm">{trends.expenseChange}%</span>
            </>
          ) : (
            <>
              <FiTrendingUp className="text-red-500 mr-1" />
              <span className="text-red-500 text-sm">+{trends.expenseChange}%</span>
            </>
          )}
          <span className="text-gray-500 text-sm ml-1">from last period</span>
        </div>
      </div>

      {/* Savings Card */}
      <div className={`p-6 rounded-lg shadow-md shadow-black ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">Total Savings</p>
            <h2 className="text-2xl font-bold mt-1">{formatCurrency(summary.savings)}</h2>
          </div>
          <div className={`p-3 rounded-full ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600'}`}>
            <FiDollarSign className="text-xl" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {trends.savingsChange >= 0 ? (
            <>
              <FiTrendingUp className="text-green-500 mr-1" />
              <span className="text-green-500 text-sm">+{trends.savingsChange}%</span>
            </>
          ) : (
            <>
              <FiTrendingDown className="text-red-500 mr-1" />
              <span className="text-red-500 text-sm">{trends.savingsChange}%</span>
            </>
          )}
          <span className="text-gray-500 text-sm ml-1">from last period</span>
        </div>
      </div>

      {/* Savings Rate Card */}
      <div className={`p-6 rounded-lg shadow-md shadow-black ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">Savings Rate</p>
            <h2 className="text-2xl font-bold mt-1">{summary.savingsRate}%</h2>
          </div>
          <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
            <FiPieChart className="text-xl" />
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${summary.savingsRate}%` }}></div>
          </div>
          <p className="text-gray-500 text-sm mt-1">of total income</p>
        </div>
      </div>
    </div>
  );
}