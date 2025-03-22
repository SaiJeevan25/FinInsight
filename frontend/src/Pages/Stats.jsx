import { useTheme } from "../Components/ThemeContext";
import { useState, useEffect } from "react";
import {
  FiArrowUp,
  FiArrowDown,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiPieChart,
  FiBarChart2,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiTarget,
  FiAward,
  FiZap,
  FiFileText
} from "react-icons/fi";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Helper to format currency
const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export default function StatsPage() {
  const { darkMode } = useTheme();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [timeRange, setTimeRange] = useState("month"); // "month", "quarter", "year"
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState(null);

  // Fetch stats data from backend
  useEffect(() => {
    // This will be replaced with your actual API call
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Sample data - replace with actual API response
      setStatsData({
        summary: {
          income: 91200,
          expenses: 34200,
          savings: 57000,
          savingsRate: 62.5
        },
        trends: {
          incomeChange: 8.3,
          expenseChange: -4.2,
          savingsChange: 15.7
        },
        categoryBreakdown: [
          { category: "Food", amount: 12500, percentage: 36.5, icon: "FiCoffee" },
          { category: "Rent", amount: 22000, percentage: 64.3, icon: "FiHome" },
          { category: "Shopping", amount: 10200, percentage: 29.8, icon: "FiShoppingBag" },
          { category: "Transport", amount: 3500, percentage: 10.2, icon: "FiTruck" },
          { category: "Utilities", amount: 4800, percentage: 14.0, icon: "FiMonitor" }
        ],
        monthlyData: {
          income: [82500, 86000, 88200, 91200],
          expenses: [30500, 32800, 35600, 34200],
          savings: [52000, 53200, 52600, 57000]
        }
      });
      
      // Generate AI insights based on the data
      setAiInsights([
        {
          type: "achievement",
          title: "Savings Milestone",
          description: "You've reached a 62.5% savings rate, which is excellent! This puts you in the top 15% of savers in your income bracket.",
          icon: "FiAward",
          severity: "success"
        },
        {
          type: "anomaly",
          title: "Unusual Spending",
          description: "Your shopping expenses are 18% higher than your 6-month average. Consider reviewing recent purchases.",
          icon: "FiAlertCircle",
          severity: "warning"
        },
        {
          type: "prediction",
          title: "Income Trend",
          description: "Based on your growth pattern, you're on track to reach ₹95,000 monthly income next month.",
          icon: "FiTrendingUp",
          severity: "info"
        },
        {
          type: "recommendation",
          title: "Expense Optimization",
          description: "Reducing your food expenses by just 10% would increase your savings rate to 66%.",
          icon: "FiTarget",
          severity: "info"
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, [currentMonthIndex, currentYear, timeRange]);

  const handlePrevMonth = () => {
    setCurrentMonthIndex((prev) => {
      if (prev === 0) {
        setCurrentYear(year => year - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prev) => {
      if (prev === 11) {
        setCurrentYear(year => year + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  // Get time range text based on selection
  const getTimeRangeText = () => {
    if (timeRange === "month") {
      return `${monthNames[currentMonthIndex]} ${currentYear}`;
    } else if (timeRange === "quarter") {
      const quarter = Math.floor(currentMonthIndex / 3) + 1;
      return `Q${quarter} ${currentYear}`;
    } else {
      return currentYear.toString();
    }
  };

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
      default: return <FiZap />;  // Using FiZap as default instead of FiBrain
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full mt-20 px-4 py-6 md:px-8">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          {["month", "quarter", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg capitalize ${
                timeRange === range
                  ? `bg-indigo-500 text-white`
                  : `${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handlePrevMonth}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <FiChevronLeft className="text-xl" />
          </button>
          
          <div className="flex items-center">
            <FiCalendar className="mr-2 text-indigo-500" />
            <span className="font-semibold">{getTimeRangeText()}</span>
          </div>
          
          <button 
            onClick={handleNextMonth}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <FiChevronRight className="text-xl" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Income Card */}
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Income</p>
              <h2 className="text-2xl font-bold mt-1">{formatCurrency(statsData.summary.income)}</h2>
            </div>
            <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
              <FiArrowDown className="text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {statsData.trends.incomeChange >= 0 ? (
              <>
                <FiTrendingUp className="text-green-500 mr-1" />
                <span className="text-green-500 text-sm">+{statsData.trends.incomeChange}%</span>
              </>
            ) : (
              <>
                <FiTrendingDown className="text-red-500 mr-1" />
                <span className="text-red-500 text-sm">{statsData.trends.incomeChange}%</span>
              </>
            )}
            <span className="text-gray-500 text-sm ml-1">from last period</span>
          </div>
        </div>

        {/* Expenses Card */}
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Expenses</p>
              <h2 className="text-2xl font-bold mt-1">{formatCurrency(statsData.summary.expenses)}</h2>
            </div>
            <div className={`p-3 rounded-full ${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600'}`}>
              <FiArrowUp className="text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {statsData.trends.expenseChange <= 0 ? (
              <>
                <FiTrendingDown className="text-green-500 mr-1" />
                <span className="text-green-500 text-sm">{statsData.trends.expenseChange}%</span>
              </>
            ) : (
              <>
                <FiTrendingUp className="text-red-500 mr-1" />
                <span className="text-red-500 text-sm">+{statsData.trends.expenseChange}%</span>
              </>
            )}
            <span className="text-gray-500 text-sm ml-1">from last period</span>
          </div>
        </div>

        {/* Savings Card */}
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Savings</p>
              <h2 className="text-2xl font-bold mt-1">{formatCurrency(statsData.summary.savings)}</h2>
            </div>
            <div className={`p-3 rounded-full ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600'}`}>
              <FiDollarSign className="text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {statsData.trends.savingsChange >= 0 ? (
              <>
                <FiTrendingUp className="text-green-500 mr-1" />
                <span className="text-green-500 text-sm">+{statsData.trends.savingsChange}%</span>
              </>
            ) : (
              <>
                <FiTrendingDown className="text-red-500 mr-1" />
                <span className="text-red-500 text-sm">{statsData.trends.savingsChange}%</span>
              </>
            )}
            <span className="text-gray-500 text-sm ml-1">from last period</span>
          </div>
        </div>

        {/* Savings Rate Card */}
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Savings Rate</p>
              <h2 className="text-2xl font-bold mt-1">{statsData.summary.savingsRate}%</h2>
            </div>
            <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
              <FiPieChart className="text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${statsData.summary.savingsRate}%` }}></div>
            </div>
            <p className="text-gray-500 text-sm mt-1">of total income</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Expense Categories Breakdown */}
        <div className={`p-6 rounded-lg shadow-md col-span-1 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Expense Breakdown</h3>
            <FiPieChart className="text-indigo-500" />
          </div>
          
          <div className="space-y-4">
            {statsData.categoryBreakdown.map((category, index) => (
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

        {/* Monthly Trends Chart */}
        <div className={`p-6 rounded-lg shadow-md col-span-1 lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Monthly Trends</h3>
            <FiBarChart2 className="text-indigo-500" />
          </div>
          
          <div className="flex justify-center mt-8 space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm">Income</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span className="text-sm">Expenses</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-sm">Savings</span>
            </div>
          </div>
        </div>

        {/* AI Insights Column */}
        <div className={`p-6 rounded-lg shadow-md col-span-1 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">AI Insights</h3>
            <FiZap className="text-indigo-500" />
          </div>
          
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
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
      </div>
    </div>
  );
}

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