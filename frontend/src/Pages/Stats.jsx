import { useTheme } from "../Components/ThemeContext";
import { useState, useEffect } from "react";
import TimeRangeSelector from "./StatsPage/TimeRangeSelector";
import SummaryCards from "./StatsPage/SummaryCards";
import DynamicTrends from "./StatsPage/DynamicTrends";
import AIInsights from "./StatsPage/AIInsights";

import Breakdown from "./StatsPage/Breakdown";

const monthNames = ["Jan", "Feb", "March", "April", "May", "June", "July", "August", "Sept", "October", "Nov", "Dec"];

export default function StatsPage() {
  const { darkMode } = useTheme();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [timeRange, setTimeRange] = useState("month");
  const [activeView, setActiveView] = useState("breakdown");
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState([]);
  const [error, setError] = useState(null);


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
      case "breakdown":
        return (
          <div>
            <div>
              <SummaryCards summary={statsData.summary} trends={statsData.trends} darkMode={darkMode} />
            </div>
            <div className="mx-auto">
              <Breakdown
                categoryBreakdown={statsData.categoryBreakdown}
                incomeBreakdown={statsData.incomeBreakdown}
                darkMode={darkMode} />
            </div>
          </div>
        );
      case "trends":
        return (
          <div className="w-full  mx-auto">
            <DynamicTrends 
              monthlyData={statsData.monthlyData} 
              timeRange={timeRange} 
              darkMode={darkMode}
              categoryBreakdown={statsData.categoryBreakdown || []}
              incomeBreakdown={statsData.incomeBreakdown || []}
            />
          </div>
        );
      case "insights":
        return (
          <div className="w-full max-w-5xl mx-auto">
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