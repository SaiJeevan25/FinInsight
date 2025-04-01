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
  const [timeRange, setTimeRange] = useState("month");
  const [activeView, setActiveView] = useState("summary");
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState([]);
  const [error, setError] = useState(null);

  // Sample data for fallback
  const sampleData = {
    summary: {
      income: 72000,
      expenses: 48200,
      savings: 23800,
      savingsRate: 33.06
    },
    trends: {
      incomeChange: 5.2,
      expenseChange: -3.8,
      savingsChange: 12.4
    },
    categoryBreakdown: [
      { category: "Rent", amount: 22000, percentage: 45.6 },
      { category: "Food", amount: 12500, percentage: 25.9 },
      { category: "Shopping", amount: 10200, percentage: 21.2 },
      { category: "Transport", amount: 3500, percentage: 7.3 }
    ],
    incomeBreakdown: [
      { category: "Salary", amount: 50000, percentage: 69.4 },
      { category: "Freelance", amount: 15000, percentage: 20.8 },
      { category: "Investments", amount: 7000, percentage: 9.7 }
    ],
    monthlyData: {
      income: Array(12).fill(0).map((_, i) => 50000 + i * 2000),
      expenses: Array(12).fill(0).map((_, i) => 40000 + i * 1000),
      savings: Array(12).fill(0).map((_, i) => 10000 + i * 1000)
    }
  };

  const sampleInsights = [
    {
      type: "achievement",
      title: "Savings Increased",
      description: "Your savings rate improved by 12.4% compared to last period",
      severity: "success"
    },
    {
      type: "observation",
      title: "High Rent Percentage",
      description: "Your rent accounts for 45.6% of total expenses",
      severity: "warning"
    }
  ];

  useEffect(() => {
    const fetchStatsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');

        const apiUrl = new URL('http://localhost:8000/api/stats');
        apiUrl.searchParams.append('year', currentYear);
        apiUrl.searchParams.append('month', currentMonthIndex + 1);
        apiUrl.searchParams.append('timeRange', timeRange);

        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        setStatsData({
          summary: {
            income: data.summary?.income || 0,
            expenses: data.summary?.expenses || 0,
            savings: data.summary?.savings || 0,
            savingsRate: data.summary?.savingsRate || 0
          },
          trends: {
            incomeChange: data.trends?.incomeChange || 0,
            expenseChange: data.trends?.expenseChange || 0,
            savingsChange: data.trends?.savingsChange || 0
          },
          categoryBreakdown: data.categoryBreakdown || [],
          incomeBreakdown: data.incomeBreakdown || [],
          monthlyData: data.monthlyData || {
            income: Array(timeRange === "quarter" ? 3 : 12).fill(0),
            expenses: Array(timeRange === "quarter" ? 3 : 12).fill(0),
            savings: Array(timeRange === "quarter" ? 3 : 12).fill(0)
          }
        });
        
        setAiInsights(data.aiInsights || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError(error.message);
        setStatsData(sampleData);
        setAiInsights(sampleInsights);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, [currentMonthIndex, currentYear, timeRange]);

  const handlePrevMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonthIndex === 0) {
      setCurrentYear(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonthIndex === 11) {
      setCurrentYear(prev => prev + 1);
    }
  };

  const getTimeRangeText = () => {
    if (timeRange === "month") return `${monthNames[currentMonthIndex]} ${currentYear}`;
    if (timeRange === "quarter") return `Q${Math.floor(currentMonthIndex / 3) + 1} ${currentYear}`;
    return currentYear.toString();
  };

  const renderActiveView = () => {
    if (!statsData) return null;

    switch (activeView) {
      case "summary":
        return <SummaryCards summary={statsData.summary} trends={statsData.trends} darkMode={darkMode} />;
      case "breakdown":
        return (
          <div className="mx-auto">
            <Breakdown 
            categoryBreakdown={statsData.categoryBreakdown} 
            incomeBreakdown={statsData.incomeBreakdown}
            darkMode={darkMode} />
          </div>
        );
      case "trends":
        return (
          <div className="w-full max-w-4xl mx-auto">
            <DynamicTrends monthlyData={statsData.monthlyData} timeRange={timeRange} darkMode={darkMode} />
          </div>
        );
      case "insights":
        return (
          <div className="w-full max-w-3xl mx-auto">
            <AIInsights insights={aiInsights} darkMode={darkMode} />
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

  if (error) {
    return (
      <div className="flex justify-center items-center h-[25rem]">
        <div className="text-red-500">{error} (Showing sample data)</div>
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