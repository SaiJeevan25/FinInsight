import React, { useState, useEffect } from 'react';
import { FiZap, FiAward, FiAlertCircle, FiTrendingUp, FiTarget} from "react-icons/fi";

export default function AIInsights({ insights, darkMode }) {
  const [expandedInsight, setExpandedInsight] = useState(null);
  const [visibleInsights, setVisibleInsights] = useState([]);
  const [highlightedInsight, setHighlightedInsight] = useState(null);

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

  // Get border color for highlighted insights
  const getHighlightBorder = (severity, isDark) => {
    if (severity === "success") return isDark ? "border-green-400" : "border-green-500";
    if (severity === "warning") return isDark ? "border-yellow-400" : "border-yellow-500";
    if (severity === "danger") return isDark ? "border-red-400" : "border-red-500";
    return isDark ? "border-blue-400" : "border-blue-500"; // info
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


  // Staggered animation for insights
  useEffect(() => {
    setVisibleInsights([]);
    const showInsights = async () => {
      for (let i = 0; i < insights.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setVisibleInsights(prev => [...prev, i]);
      }
    };
    showInsights();
  }, [insights]);

  // Random highlight effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (insights.length > 0) {
        const randomIndex = Math.floor(Math.random() * insights.length);
        setHighlightedInsight(randomIndex);
        setTimeout(() => setHighlightedInsight(null), 2000);
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [insights]);

  return (
    <div className={`p-6 rounded-lg shadow-md col-span-1 transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg flex items-center">
          <FiZap className="mr-2 text-indigo-500" />
          AI Insights
          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
            {insights.length}
          </span>
        </h3>          
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className={`transform transition-all duration-300 ${
              visibleInsights.includes(index) ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            } ${
              highlightedInsight === index ? `border-2 ${getHighlightBorder(insight.severity, darkMode)}` : 'border border-transparent'
            } p-4 rounded-lg cursor-pointer ${getSeverityBgColor(insight.severity, darkMode)} hover:shadow-lg`}
            onClick={() => toggleExpand(index)}
          >
            <div className="flex items-start justify-between">
              <div className="flex">
                <div className={`mt-1 mr-3 ${getSeverityColor(insight.severity, darkMode)} transition-transform duration-300 ${expandedInsight === index ? 'scale-110' : ''}`}>
                  {getInsightIcon(insight.icon)}
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1 flex items-center">
                    {insight.title}
                    {insight.severity === "danger" && 
                      <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full animate-pulse ${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-200 text-red-700'}`}>
                        Critical
                      </span>
                    }
                  </h4>
                  <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
            
            
          </div>
        ))}
      </div>
      
      {visibleInsights.length === 0 && (
        <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading insights...</p>
        </div>
      )}
      
      
    </div>
  );
}