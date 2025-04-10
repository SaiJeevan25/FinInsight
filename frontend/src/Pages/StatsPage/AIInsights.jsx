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
    goals: false,
    tips: true
  });

  const spendingInsights = {
    title: "Spending Behavior Insights",
    icon: <FiShoppingBag className="text-lg" />,
    items: [
      { icon: <FiPieChart />, title: "Top Categories", description: "You spent the most on Food (₹6,000) this month." },
      { icon: <FiTrendingUp />, title: "Trends", description: "Your transport expenses increased by 20% compared to last month." },
      { icon: <FiCalendar />, title: "High-Spend Days", description: "Most of your spending happens on weekends." },
      { icon: <FiAlertTriangle />, title: "Unusual Transactions", description: "You had an unusually high transaction on April 5 – ₹15,000.", severity: "warning" }
    ]
  };

  const savingsInsights = {
    title: "Saving Opportunities",
    icon: <FiDollarSign className="text-lg" />,
    items: [
      { icon: <FiBarChart2 />, title: "Monthly Comparison", description: "If you reduce dining out by 10%, you can save ₹1,200/month." },
      { icon: <FiCreditCard />, title: "Recurring Subscriptions", description: "You are paying ₹499/month to Netflix. Do you still use it?", severity: "warning" },
      { icon: <FiTarget />, title: "Budget Suggestions", description: "Based on your data, you should set a food budget of ₹5,000." }
    ]
  };

  const cashflowInsights = {
    title: "Cash Flow Analysis",
    icon: <FiBarChart2 className="text-lg" />,
    items: [
      { icon: <FiBarChart2 />, title: "Overview", description: "Income: ₹45,000 | Expenses: ₹32,000" },
      { icon: <FiTrendingUp />, title: "Cash Flow Health Score", description: "Your cash flow is healthy — income is consistently greater than expenses.", severity: "success" }
    ]
  };

  const personalizedTips = {
    title: "Personalized Tips",
    icon: <FiZap className="text-lg" />,
    items: [
      { icon: <FiDollarSign />, title: "Food Ordering", description: "You've ordered food 12 times this month. Try cooking at home 2 extra days/week to save ₹1,000." },
      { icon: <FiDollarSign />, title: "Transport", description: "Consider using public transport 3x/week — you could save ₹500/month." }
    ]
  };
  const anomalyAlerts =
  {
    title: "Unusual Activity",
    icon: <FiAlertTriangle className="text-lg text-yellow-500" />,
    items: [
      {
        icon: <FiActivity />, title: "Spending Spike",
        description: "You spent ₹9,000 on Shopping on Apr 5 — that's 3x your usual average for that day."
      },
      {
        icon: <FiMapPin />, title: "New Merchant",
        description: "First-time transaction at Swiggy Instamart: ₹1,100 on Apr 2. Just checking — was this you?"
      }
    ]
  };

  const goalTracking =
  {
    title: "Goal & Budget Tracking",
    icon: <FiTarget className="text-lg text-green-500" />,
    items: [
      {
        icon: <FiTrendingUp />, title: "Food Budget", description: "You’ve used 82% of your ₹6,000 food budget this month. Try to stay within target."
      },
      {
        icon: <FiTrendingDown />, title: "Savings Goal", description: "You’ve saved ₹3,200 so far — 64% of your ₹5,000 monthly goal."
      }
    ]
  };


  const allInsightSections = [
    spendingInsights,
    savingsInsights,
    cashflowInsights,
    anomalyAlerts,
    personalizedTips,
    goalTracking

  ];


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
    <div className={`p-6 rounded-lg shadow-md transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      
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