import React from 'react';
import { FiZap, FiAward, FiAlertCircle, FiTrendingUp, FiTarget } from "react-icons/fi";

export default function AIInsights({ insights, darkMode }) {
  // Helper to get icon color based on severity
  const getSeverityColor = (severity, isDark) => {
    if (severity === "success") return isDark ? "text-green-400" : "text-green-600";
    if (severity === "warning") return isDark ? "text-yellow-400" : "text-yellow-600";
    if (severity === "danger") return isDark ? "text-red-400" : "text-red-600";
    return isDark ? "text-blue-400" : "text-blue-600"; // info
  };

  // Helper to get background color based on severity
  const getSeverityBgColor = (severity, isDark) => {
    if (severity === "success") return isDark ? "bg-green-900/30" : "bg-green-100";
    if (severity === "warning") return isDark ? "bg-yellow-900/30" : "bg-yellow-100";
    if (severity === "danger") return isDark ? "bg-red-900/30" : "bg-red-100";
    return isDark ? "bg-blue-900/30" : "bg-blue-100"; // info
  };

  // Get icon component based on icon name
  const getInsightIcon = (iconName) => {
    switch (iconName) {
      case "FiAward": return <FiAward />;
      case "FiAlertCircle": return <FiAlertCircle />;
      case "FiTrendingUp": return <FiTrendingUp />;
      case "FiTarget": return <FiTarget />;
      default: return <FiZap />;  // Using FiZap as default
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md col-span-1 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">AI Insights</h3>
        <FiZap className="text-indigo-500" />
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg ${getSeverityBgColor(insight.severity, darkMode)}`}
          >
            <div className="flex items-start">
              <div className={`mt-1 mr-3 ${getSeverityColor(insight.severity, darkMode)}`}>
                {getInsightIcon(insight.icon)}
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}