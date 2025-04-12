import React, { useState, useEffect } from 'react';
import {
  FiZap, FiShoppingBag, FiTrendingUp, FiCalendar, FiAlertTriangle,
  FiPieChart, FiDollarSign, FiTarget, FiCreditCard, FiBarChart2,
  FiMapPin, FiTrendingDown, FiClock, FiActivity, FiArrowDown, FiChevronDown, FiChevronRight
} from "react-icons/fi";


export default function AIInsights({ insights, darkMode }) {
  const [visibleInsights, setVisibleInsights] = useState([]);
  const [activeView, setActiveView] = useState('summary');
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
    if (severity === "warning") return isDark ? "text-yellow-400" : "text-yellow-600";
    if (severity === "danger") return isDark ? "text-red-400" : "text-red-600";
    return isDark ? "text-blue-400" : "text-blue-600";
  };

  const getSeverityBgColor = (severity, isDark) => {
    if (!severity) return "";
    if (severity === "success") return isDark ? "bg-green-900/30" : "bg-green-100";
    if (severity === "warning") return isDark ? "bg-yellow-900/30" : "bg-yellow-100";
    if (severity === "danger") return isDark ? "bg-red-900/30" : "bg-red-100";
    return isDark ? "bg-blue-900/30" : "bg-blue-100";
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

  return (
    <div className={`p-6 rounded-lg shadow-md shadow-black transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      
      <div className={`relative mb-8 rounded-full p-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <div
          className={`absolute top-1 left-1 bottom-1 w-1/2 rounded-full transition-all duration-300 ${activeView === 'prediction' ? 'translate-x-full' : 'translate-x-0'
            } ${darkMode ? 'bg-indigo-600' : 'bg-indigo-500'}`}
        />

        <div className="relative flex">
          <button
            className={`flex-1 py-2 z-10 rounded-full text-sm font-medium transition-colors duration-200 flex items-center justify-center ${activeView === 'summary'
              ? 'text-white'
              : (darkMode ? 'text-gray-300' : 'text-gray-600')
              }`}
            onClick={() => setActiveView('summary')}
          >
            <FiActivity className="mr-2" />
            Current Summary
          </button>
          <button
            className={`flex-1 py-2 z-10 rounded-full text-sm font-medium transition-colors duration-200 flex items-center justify-center ${activeView === 'prediction'
              ? 'text-white'
              : (darkMode ? 'text-gray-300' : 'text-gray-600')
              }`}
            onClick={() => setActiveView('prediction')}
          >
            <FiClock className="mr-2" />
            Future Projection
          </button>
        </div>
      </div>

      {/* Insights Sections */}
      <div className="space-y-6">
        {getDisplayedInsights().map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className={`transform transition-all duration-500 ${visibleInsights.includes(sectionIndex) ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              } border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            {/* Section Header */}
            <div
              className={`flex justify-between items-center p-4 cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded-t-lg`}
              onClick={() => toggleSection(section.title.toLowerCase().split(' ')[0])}
            >
              <div className="flex items-center">
                <div className={`mr-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  {section.icon}
                </div>
                <h4 className="font-medium">{section.title}</h4>
                {section.isPrediction && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-200 text-purple-700'}`}>
                    Prediction
                  </span>
                )}
              </div>
              <div>
                {expandedSections[section.title.toLowerCase().split(' ')[0]] ? (
                  <FiChevronDown className="text-gray-500" />
                ) : (
                  <FiChevronRight className="text-gray-500" />
                )}
              </div>
            </div>

            {/* Section Content */}
            {expandedSections[section.title.toLowerCase().split(' ')[0]] && (
              <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`flex p-3 rounded-lg ${getSeverityBgColor(item.severity, darkMode)}`}
                    >
                      <div className={`mt-0.5 mr-3 ${getSeverityColor(item.severity, darkMode)}`}>
                        {item.icon}
                      </div>
                      <div>
                        <h5 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {item.title}
                        </h5>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {item.description}
                        </p>
                        {item.action && (
                          <button className={`mt-2 text-xs px-3 py-1 rounded-md ${darkMode ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
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
    </div>
  );
}