import React, { useState } from 'react';
import { FiTrendingUp, FiTrendingDown, FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";
import Breakdown from './Breakdown';
import { useTheme } from "../../Components/ThemeContext"

export default function AIPrediction({ }) {

  const [selectedScenario, setSelectedScenario] = useState('likely');
  const { darkMode } = useTheme();

  // Sample Data for the breakdown
  const predictionData = {
    likely: {
      totalIncome: 85000,
      totalExpenses: 65000,
      confidenceLevel: '84',
      incomeBreakdown: [
        { category: "Salary", amount: 70000, percentage: 82.35 },
        { category: "Freelance", amount: 10000, percentage: 11.76 },
        { category: "Investments", amount: 5000, percentage: 5.89 }
      ],
      expenseBreakdown: [
        { category: "Housing", amount: 25000, percentage: 38.46 },
        { category: "Groceries", amount: 10000, percentage: 15.38 },
        { category: "Transportation", amount: 8000, percentage: 12.31 },
        { category: "Entertainment", amount: 7000, percentage: 10.77 },
        { category: "Utilities", amount: 5000, percentage: 7.69 },
        { category: "Miscellaneous", amount: 10000, percentage: 15.39 }
      ],
      alerts: [
        {
          title: "Entertainment expenses increasing",
          description: "Your entertainment spending is predicted to be 15% higher than usual next month.",
          severity: "warning"
        }
      ],
      suggestions: [
        {
          title: "Reduce discretionary spending",
          description: "Consider cutting back on entertainment expenses by ₹1,000 to improve your savings rate."
        },
        {
          title: "Good saving trend",
          description: "You're on track to save about 24% of your income next month.",
          severity: "success"
        }
      ]
    },
    best: {
      totalIncome: 92000,
      totalExpenses: 60000,
      confidenceLevel: '60',
      incomeBreakdown: [
        { category: "Salary", amount: 70000, percentage: 76.09 },
        { category: "Freelance", amount: 15000, percentage: 16.30 },
        { category: "Investments", amount: 7000, percentage: 7.61 }
      ],
      expenseBreakdown: [
        { category: "Housing", amount: 25000, percentage: 41.67 },
        { category: "Groceries", amount: 9000, percentage: 15.00 },
        { category: "Transportation", amount: 7000, percentage: 11.67 },
        { category: "Entertainment", amount: 6000, percentage: 10.00 },
        { category: "Utilities", amount: 5000, percentage: 8.33 },
        { category: "Miscellaneous", amount: 8000, percentage: 13.33 }
      ],
      alerts: [],
      suggestions: [
        {
          title: "Excellent saving opportunity",
          description: "You could save up to 35% of your income under this scenario.",
          severity: "success"
        },
        {
          title: "Consider investments",
          description: "With the extra savings, consider increasing your investment allocation."
        }
      ]
    },
    worst: {
      totalIncome: 75000,
      totalExpenses: 70000,
      confidenceLevel: '90',
      incomeBreakdown: [
        { category: "Salary", amount: 70000, percentage: 93.33 },
        { category: "Freelance", amount: 3000, percentage: 4.00 },
        { category: "Investments", amount: 2000, percentage: 2.67 }
      ],
      expenseBreakdown: [
        { category: "Housing", amount: 25000, percentage: 35.71 },
        { category: "Groceries", amount: 12000, percentage: 17.14 },
        { category: "Transportation", amount: 8000, percentage: 11.43 },
        { category: "Entertainment", amount: 8000, percentage: 11.43 },
        { category: "Utilities", amount: 6000, percentage: 8.57 },
        { category: "Miscellaneous", amount: 11000, percentage: 15.72 }
      ],
      alerts: [
        {
          title: "Low savings margin",
          description: "Your expenses are predicted to be 93% of your income, leaving little room for savings.",
          severity: "danger"
        },
        {
          title: "Grocery expenses increasing",
          description: "Your grocery spending is predicted to increase by 20% next month.",
          severity: "warning"
        }
      ],
      suggestions: [
        {
          title: "Emergency cost-cutting",
          description: "Consider reducing entertainment and miscellaneous expenses by at least ₹5,000."
        },
        {
          title: "Seek additional income",
          description: "Look for additional freelance opportunities to increase your income buffer."
        }
      ]
    }
  };

  const currentScenario = predictionData[selectedScenario];

  const getConfidenceWidth = (level) => `${level}%`;


  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getSeverityColor = (severity) => {
    if (!severity) return darkMode ? "text-gray-300" : "text-gray-700";
    if (severity === "success") return darkMode ? "text-green-400" : "text-green-600";
    if (severity === "warning") return darkMode ? "text-yellow-400" : "text-yellow-600";
    if (severity === "danger") return darkMode ? "text-red-400" : "text-red-600";
    return darkMode ? "text-blue-400" : "text-blue-600";
  };

  const getSeverityBgColor = (severity) => {
    if (!severity) return "";
    if (severity === "success") return darkMode ? "bg-green-900/30" : "bg-green-100";
    if (severity === "warning") return darkMode ? "bg-yellow-900/30" : "bg-yellow-100";
    if (severity === "danger") return darkMode ? "bg-red-900/30" : "bg-red-100";
    return darkMode ? "bg-blue-900/30" : "bg-blue-100";
  };

  const getSeverityIcon = (severity) => {
    if (severity === "success") return <FiCheckCircle />;
    if (severity === "warning") return <FiAlertCircle />;
    if (severity === "danger") return <FiAlertCircle />;
    return <FiInfo />;
  };

  return (
    <div className="space-y-6">
      <div className={`flex justify-center mb-6`}>
        <div className={`inline-flex rounded-xl p- ${darkMode ? 'bg-gray-800' : 'bg-gray-00'}`}>
          {['likely', 'best', 'worst'].map((scenario) => (
            <button
              key={scenario}
              className={`px-4 py-2 text-sm font-medium 
                ${scenario === "likely" ? 'rounded-l-xl' : scenario === "worst" ? 'rounded-r-xl' : ""}
                transition-colors ${selectedScenario === scenario
                  ? `${darkMode ? 'bg-indigo-600' : 'bg-indigo-500'} text-white`
                  : `${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'}`
                }`}
              onClick={() => setSelectedScenario(scenario)}
            >
              {scenario === 'likely' ? 'Most Likely' : scenario === 'best' ? 'Best Case' : 'Worst Case'}
            </button>
          ))}
        </div>
      </div>

      {/* Prediction Header */}
      <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Next Month Prediction
          </h3>
          <div className='flex gap-2'>
            <div className="relative px-54 bg-gray-500 py-1 rounded-xl">
              <div
                className="absolute top-0 left-0 bg-green-500 h-full rounded-xl"
                style={{ width: getConfidenceWidth(currentScenario.confidenceLevel) }}
              />

            </div>
            Confidence - {getConfidenceWidth(currentScenario.confidenceLevel)}
          </div>
        </div>

        {/* Income & Expense Overview */}
        <div className="grid grid-cols-1  md:grid-cols-2 gap-6">
          <div className={`p-4 flex flex-col items-center rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center mb-2">
              <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Predicted Income</h4>
            </div>
            <div className={`text-2xl font-bold flex justify-center gap-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {formatCurrency(currentScenario.totalIncome)}
              <p className='flex items-center text-sm'>
                (<FiTrendingUp className={`mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} /> 20%)
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center mb-2">
              <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Predicted Expenses</h4>
            </div>
            <div className={`text-2xl font-bold flex justify-center gap-3 ${darkMode ? 'text-gre-400' : 'text-green-600'}`}>
              {formatCurrency(currentScenario.totalIncome)}
              <p className='flex items-center text-sm'>
                (<FiTrendingDown className={`mr-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`} /> 20%)
              </p>
            </div>
          </div>
        </div>

        {/* Savings */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Predicted Savings
            </p>
            <p className={`font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              {formatCurrency(currentScenario.totalIncome - currentScenario.totalExpenses)}
            </p>
          </div>
          <div className={`w-full mt-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
            <div
              className={`h-2 rounded-full ${darkMode ? 'bg-indigo-500' : 'bg-indigo-600'}`}
              style={{ width: `${((currentScenario.totalIncome - currentScenario.totalExpenses) / currentScenario.totalIncome * 100).toFixed(0)}%` }}
            ></div>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            {((currentScenario.totalIncome - currentScenario.totalExpenses) / currentScenario.totalIncome * 100).toFixed(0)}% of income
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mt-6">
        <h3 className={`text-lg text-center font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Predicted Category Breakdown</h3>
        <Breakdown
          categoryBreakdown={currentScenario.expenseBreakdown}
          incomeBreakdown={currentScenario.incomeBreakdown}
          darkMode={darkMode}
        />
      </div>

      {/* Alerts & Suggestions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className={`p-5 rounded-lg shadow-md ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Alerts</h3>

          {currentScenario.alerts.length > 0 ? (
            <div className="space-y-3">
              {currentScenario.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex p-3 rounded-lg ${getSeverityBgColor(alert.severity)}`}
                >
                  <div className={`mt-0.5 mr-3 ${getSeverityColor(alert.severity)}`}>
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div>
                    <h5 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {alert.title}
                    </h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {alert.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              No alerts for this scenario.
            </p>
          )}
        </div>

        {/* Suggestions */}
        <div className={`p-5 rounded-lg shadow-md ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Suggestions</h3>

          <div className="space-y-3">
            {currentScenario.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`flex p-3 rounded-lg ${getSeverityBgColor(suggestion.severity)}`}
              >
                <div className={`mt-0.5 mr-3 ${getSeverityColor(suggestion.severity)}`}>
                  {getSeverityIcon(suggestion.severity)}
                </div>
                <div>
                  <h5 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {suggestion.title}
                  </h5>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {suggestion.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}