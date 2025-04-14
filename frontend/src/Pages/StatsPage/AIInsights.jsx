import React, { useState, useEffect } from 'react';
import {
  FiShoppingBag, FiAlertTriangle,
  FiDollarSign, FiTarget, FiBarChart2,
  FiMapPin, FiClock, FiActivity, FiChevronDown, 
  FiChevronRight, FiPieChart, FiLayout, FiGrid
} from "react-icons/fi";
import AIPrediction from './AIPrediction';

export default function AIInsights({ insights, darkMode }) {
  const [visibleInsights, setVisibleInsights] = useState([]);
  const [activeView, setActiveView] = useState('summary');
  const [layoutMode, setLayoutMode] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    spending: true,
    savings: true,
    cashflow: false,
    anomalies: false,
    recommendations: true
  });

  const mapInsightTypeToIcon = (type) => {
    switch(type) {
      case 'spending': return <FiShoppingBag />;
      case 'savings': return <FiDollarSign />;
      case 'cashflow': return <FiBarChart2 />;
      case 'anomaly': return <FiAlertTriangle />;
      case 'recommendation': return <FiTarget />;
      default: return <FiActivity />;
    }
  };

  const organizeInsights = (insights) => {
    const organized = {
      spending: {
        title: "Spending Insights",
        icon: <FiShoppingBag className="text-lg" />,
        items: []
      },
      savings: {
        title: "Savings Insights",
        icon: <FiDollarSign className="text-lg" />,
        items: []
      },
      cashflow: {
        title: "Cash Flow Analysis",
        icon: <FiBarChart2 className="text-lg" />,
        items: []
      },
      anomalies: {
        title: "Unusual Activity",
        icon: <FiAlertTriangle className="text-lg text-yellow-500" />,
        items: []
      },
      recommendations: {
        title: "Recommendations",
        icon: <FiTarget className="text-lg text-green-500" />,
        items: []
      }
    };

    insights.forEach(insight => {
      const item = {
        icon: mapInsightTypeToIcon(insight.type),
        title: insight.title,
        description: insight.description,
        severity: insight.severity,
        action: insight.action
      };

      if (insight.type.includes('spend') || insight.type.includes('expense')) {
        organized.spending.items.push(item);
      } else if (insight.type.includes('sav')) {
        organized.savings.items.push(item);
      } else if (insight.type.includes('cash') || insight.type.includes('income')) {
        organized.cashflow.items.push(item);
      } else if (insight.type.includes('anomaly') || insight.severity === 'warning') {
        organized.anomalies.items.push(item);
      } else {
        organized.recommendations.items.push(item);
      }
    });

    return Object.values(organized).filter(section => section.items.length > 0);
  };

  const allInsightSections = organizeInsights(insights || []);

  const getDisplayedInsights = () => {
    if (activeView === 'summary') {
      return allInsightSections.filter(section => !section.isPrediction);
    } else {
      return allInsightSections.filter(section => section.isPrediction);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSeverityColor = (severity, isDark) => {
    if (!severity) return isDark ? "text-gray-300" : "text-gray-700";
    if (severity === "success") return isDark ? "text-green-400" : "text-green-600";
    if (severity === "warning") return isDark ? "text-yellow-500" : "text-yellow-700";
    if (severity === "danger") return isDark ? "text-red-400" : "text-red-600";
    return isDark ? "text-blue-400" : "text-blue-600";
  };

  const getSeverityBgColor = (severity, isDark) => {
    if (!severity) return "";
    if (severity === "success") return isDark ? "bg-green-600/30" : "bg-green-100";
    if (severity === "warning") return isDark ? "bg-yellow-600/50" : "bg-yellow-200";
    if (severity === "danger") return isDark ? "bg-red-600/30" : "bg-red-100";
    return isDark ? "bg-blue-600/30" : "bg-blue-100";
  };

  useEffect(() => {
    setVisibleInsights([]);
    const showInsights = async () => {
      for (let i = 0; i < allInsightSections.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setVisibleInsights(prev => [...prev, i]);
      }
    };
    showInsights();
  }, [activeView]);

  const displayedInsights = getDisplayedInsights();

  return (
    <div className={`w-full rounded-lg transition-all shadow-xl shadow-black duration-300  ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>

      <div className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 shadow-md flex flex-col sm:flex-row justify-between items-center`}>
        <h2 className="text-xl font-semibold mb-4 sm:mb-0 flex items-center">
          <FiPieChart className={`mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          Financial Summary
        </h2>
        
        <div className="flex items-center space-x-4">
          <div className={`rounded-full p-1 flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center ${
                activeView === 'summary' 
                  ? `${darkMode ? 'bg-indigo-600' : 'bg-indigo-500'} text-white` 
                  : ''
              }`}
              onClick={() => setActiveView('summary')}
            >
              <FiActivity className="mr-2 text-sm" />
              Current
            </button>
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center ${
                activeView === 'prediction' 
                  ? `${darkMode ? 'bg-indigo-600' : 'bg-indigo-500'} text-white` 
                  : ''
              }`}
              onClick={() => setActiveView('prediction')}
            >
              <FiClock className="mr-2 text-sm" />
              Forecast
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        {activeView === "summary" ? (
          <>
            <div className= 'space-y-6'>
              {displayedInsights.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className={`transform transition-all duration-500 ${
                    visibleInsights.includes(sectionIndex) ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  } rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm overflow-hidden`}
                >
                  <div
                    className={`flex justify-between items-center p-4 cursor-pointer border-b ${
                      darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'
                    }`}
                    onClick={() => toggleSection(section.title.toLowerCase().split(' ')[0])}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 mr-3 rounded-lg ${
                        darkMode ? 'bg-gray-700 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        {section.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{section.title}</h4>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {section.items.length} insight{section.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div>
                      {expandedSections[section.title.toLowerCase().split(' ')[0]] ? (
                        <FiChevronDown className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      ) : (
                        <FiChevronRight className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </div>
                  </div>

                  {expandedSections[section.title.toLowerCase().split(' ')[0]] && (
                    <div className="p-4">
                      <div className="space-y-4">
                        {section.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className={`flex p-3 items-center rounded-lg ${getSeverityBgColor(item.severity, darkMode)}`}
                          >
                            <div className={`p-2  rounded-lg mr-3 ${
                              darkMode ? 'bg-gray-700' : 'bg-white'
                            } ${getSeverityColor(item.severity, darkMode)}`}>
                              {item.icon}
                            </div>
                            <div className="flex-1">
                              <h5 className={`text-sm font-medium mb-1 ${
                                darkMode ? 'text-gray-200' : 'text-gray-800'
                              }`}>
                                {item.title}
                              </h5>
                              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {item.description}
                              </p>
                              {item.action && (
                                <button className={`mt-3 text-xs px-4 py-1.5 rounded-lg font-medium transition-all ${
                                  darkMode 
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                                }`}>
                                  {item.action}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="  rounded-xl shadow-sm overflow-hidden">
            <AIPrediction />
          </div>
        )}
      </div>
    </div>
  );
}