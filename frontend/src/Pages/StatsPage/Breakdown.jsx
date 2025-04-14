import React from 'react';
import { FiPieChart, FiDollarSign } from "react-icons/fi";

// Helper to format currency
const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

function getColorForCategory(index, isIncome = false) {
  const expenseColors = [
    '#4F46E5', // indigo
    '#7C3AED', // purple
    '#EC4899', // pink
    '#F59E0B', // amber
    '#10B981', // emerald
    '#3B82F6', // blue
    '#EF4444'  // red
  ];
  
  const incomeColors = [
    '#059669', // green-600
    '#10B981', // green-500
    '#34D399', // green-400
    '#6EE7B7', // green-300
    '#A7F3D0', // green-200
    '#047857', // green-700
    '#065F46', // green-800
    '#064E3B'  // green-900
  ];
  
  return isIncome 
    ? incomeColors[index % incomeColors.length] 
    : expenseColors[index % expenseColors.length];
}

export default function Breakdown({ 
  categoryBreakdown,
  incomeBreakdown , 
  darkMode = false 
}) {
  // Calculate total income if percentages are not provided
  const totalIncome = incomeBreakdown.reduce((sum, category) => sum + category.amount, 0);
  
  // Calculate percentage for each income category if not already provided
  const incomeWithPercentage = incomeBreakdown.map(category => {
    if (category.percentage !== undefined) {
      return category;
    }
    return {
      ...category,
      percentage: totalIncome === 0 ? 0 : Math.round((category.amount / totalIncome) * 100)
    };
  });
  
  return (
    <div className={`flex flex-col md:flex-row  justify-evenly items-center md:items-stretch  gap-6 md:gap-3`}>
      {/* Expense Breakdown */}
      <div className={`p-6 rounded-lg  w-[20rem] md:w-[35rem] shadow-md ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Expense Breakdown</h3>
          <FiPieChart className="text-indigo-500" />
        </div>
        
        <div className="space-y-4">
          {categoryBreakdown.length > 0 ? (
            categoryBreakdown.map((category, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">{category.category}</span>
                  <span className="text-sm font-semibold">{formatCurrency(category.amount)}</span>
                </div>
                <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${category.percentage.toFixed(2)}%`,
                      backgroundColor: getColorForCategory(index)
                    }}
                  ></div>
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{category.percentage.toFixed(2)}% of total expenses</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No expense data available</p>
          )}
        </div>
      </div>
      <div></div>
      {/* Income Breakdown */}
      <div className={`p-6 rounded-lg shadow-md w-[20rem] md:w-[35rem]  ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Income Breakdown</h3>
          <FiDollarSign className="text-green-500" />
        </div>
        
        <div className="space-y-4">
          {incomeWithPercentage.length > 0 ? (
            incomeWithPercentage.map((category, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">{category.category}</span>
                  <span className="text-sm font-semibold">{formatCurrency(category.amount)}</span>
                </div>
                <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${category.percentage.toFixed(2)}%`,
                      backgroundColor: getColorForCategory(index, true)
                    }}
                  ></div>
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{category.percentage.toFixed(2)}% of total income</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No income data available</p>
          )}
        </div>
      </div>
    </div>
  );
}