import { useTheme } from "../Components/ThemeContext";
import { useState, useEffect } from "react";
import TimeRangeSelector from "./StatsPage/TimeRangeSelector";
import SummaryCards from "./StatsPage/SummaryCards";
import DynamicTrends from "./StatsPage/DynamicTrends";
import AIInsights from "./StatsPage/AIInsights";
import DashboardViewToggle from "./StatsPage/DashboardViewToggle";
import Breakdown from "./StatsPage/Breakdown";
const monthNames = ["Jan", "Feb", "March", "April", "May", "June", "July", "August", "Sept", "October", "Nov", "Dec"];

export default function StatsPage() {
  const { darkMode } = useTheme();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [timeRange, setTimeRange] = useState("month"); // "month", "quarter", "year"
  const [activeView, setActiveView] = useState("summary"); // "summary", "expenses", "trends", "insights"
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

  const renderActiveView = () => {
    if (!statsData) return null;

    switch (activeView) {
      case "summary":
        return (
          <SummaryCards
            summary={statsData.summary}
            trends={statsData.trends}
            darkMode={darkMode}
          />
        );
      case "breakdown":
        return (
          <div className="mx-auto">
            <Breakdown
              categoryBreakdown={statsData.categoryBreakdown}
              darkMode={darkMode}
            />
          </div>
        );
      case "trends":
        return (
          <div className="w-full max-w-4xl mx-auto">
            <DynamicTrends
              monthlyData={statsData.monthlyData}
              timeRange={timeRange}
              darkMode={darkMode}
            />
          </div>
        );
      case "insights":
        return (
          <div className="w-full max-w-3xl mx-auto">
            <AIInsights
              insights={aiInsights}
              darkMode={darkMode}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[25rem]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full mt-0 px-4 py-6 md:px-8">
      <TimeRangeSelector
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        currentMonthIndex={currentMonthIndex}
        currentYear={currentYear}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
        getTimeRangeText={getTimeRangeText}
        darkMode={darkMode}
      />

      <DashboardViewToggle 
        activeView={activeView} 
        setActiveView={setActiveView} 
        darkMode={darkMode} 
      />

      <div className="mt-4">
        {renderActiveView()}
      </div>
    </div>
  );
}