import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { formatIndianCurrency } from '../../utils/currencyFormatter';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChartComponent({ data, timeRange, darkMode }) {
  const generateLabels = () => {
    if (timeRange === "year") {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    } else if (timeRange === "quarter") {
      return ['Month 1', 'Month 2', 'Month 3'];
    } else {
      return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    }
  };

  const chartData = {
    labels: generateLabels(),
    datasets: [
      {
        label: 'Income',
        data: data?.income || [],
        borderColor: darkMode ? '#3b82f6' : '#2563eb',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Expenses',
        data: data?.expenses || [],
        borderColor: darkMode ? '#ef4444' : '#dc2626',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Savings',
        data: data?.savings || [],
        borderColor: darkMode ? '#10b981' : '#059669',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#e5e7eb' : '#374151',
          font: {
            size: 14
          },
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatIndianCurrency(value)}`;
          }
        },
        displayColors: true,
        usePointStyle: true,
        padding: 12,
        bodyFont: {
          size: 14
        }
      },
      title: {
        display: true,
        text: timeRange === "year" ? 'Yearly Trends' 
              : timeRange === "quarter" ? 'Quarterly Trends' 
              : 'Monthly Trends',
        color: darkMode ? '#e5e7eb' : '#374151',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
          font: {
            size: 12
          },
          callback: (value) => formatIndianCurrency(value)
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="h-[400px] w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}