import React from 'react';
import { FiPieChart } from "react-icons/fi";

// Helper to format currency
const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Helper function to get color for category
function getColorForCategory(index) {
  const colors = [
    '#4F46E5', // indigo
    '#7C3AED', // purple
    '#EC4899', // pink
    '#F59E0B', // amber
    '#10B981'  // emerald
  ];
  
  return colors[index % colors.length];
}

export default function ExpenseBreakdown({ categoryBreakdown, darkMode }) {
  return (
    <div className={`p-6 rounded-lg shadow-md col-span-1 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">Expense Breakdown</h3>
        <FiPieChart className="text-indigo-500" />
      </div>
      
      <div className="space-y-4">
        {categoryBreakdown.map((category, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">{category.category}</span>
              <span className="text-sm font-semibold">{formatCurrency(category.amount)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full" 
                style={{ 
                  width: `${category.percentage}%`,
                  backgroundColor: getColorForCategory(index)
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{category.percentage}% of total expenses</p>
          </div>
        ))}
      </div>
    </div>
  );
}