import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatIndianCurrency } from '../../utils/currencyFormatter';

const COLORS = [
  '#6366F1', '#EC4899', '#10B981', '#F59E0B', 
  '#3B82F6', '#F97316', '#8B5CF6', '#EF4444',
  '#14B8A6', '#64748B'
];

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`p-3 rounded-lg shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
              {entry.name}: {formatIndianCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CategoryList = ({ data, activeIndex, onHover, darkMode }) => {
  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      {data.map((entry, index) => (
        <div
          key={`legend-${index}`}
          className={`flex items-center p-2 rounded-lg cursor-pointer transition-all ${
            activeIndex === index 
              ? (darkMode ? 'bg-indigo-900' : 'bg-indigo-100') 
              : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
          }`}
          onMouseEnter={() => onHover(index)}
          onMouseLeave={() => onHover(null)}
        >
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <span className={`text-xs ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {entry.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function LineChartComponent({ 
  data, 
  title, 
  darkMode,
  timeRange = 'month'
}) {
  const [activeIndex, setActiveIndex] = useState(null);
  
  // Format data to match expected structure
  const formattedData = data?.map((item, index) => ({
    ...item,
    name: item.name || `Period ${index + 1}`,
    Income: item.Income || item.income || 0,
    Expenses: item.Expenses || item.expenses || 0,
    Savings: item.Savings || item.savings || 0
  })) || [];

  const onLineEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onLineLeave = () => {
    setActiveIndex(null);
  };

  // Data for legend/category list
  const lineData = [
    { name: 'Income', value: 'Income' },
    { name: 'Expenses', value: 'Expenses' },
    { name: 'Savings', value: 'Savings' }
  ];

  return (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all`}>
      <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {title} ({timeRange === 'month' ? 'Monthly' : timeRange === 'quarter' ? 'Quarterly' : 'Yearly'})
      </h3>
      
      <div className="h-[30rem] flex flex-col">
        {formattedData.length === 0 ? (
          <div className={`flex-1 flex items-center justify-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No data available
          </div>
        ) : (
          <>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={formattedData}
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  onMouseEnter={onLineEnter}
                  onMouseLeave={onLineLeave}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={darkMode ? '#4B5563' : '#E5E7EB'} 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="name" 
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'} 
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />
                  <YAxis 
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'} 
                    tickFormatter={(value) => formatIndianCurrency(value)}
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />
                  <Tooltip 
                    content={<CustomTooltip darkMode={darkMode} />}
                    wrapperStyle={{ zIndex: 1000 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Income"
                    stroke={COLORS[0]}
                    strokeWidth={activeIndex === 0 ? 3 : 2}
                    dot={{ r: activeIndex === 0 ? 5 : 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={500}
                  />
                  <Line
                    type="monotone"
                    dataKey="Expenses"
                    stroke={COLORS[3]}
                    strokeWidth={activeIndex === 1 ? 3 : 2}
                    dot={{ r: activeIndex === 1 ? 5 : 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={500}
                  />
                  <Line
                    type="monotone"
                    dataKey="Savings"
                    stroke={COLORS[2]}
                    strokeWidth={activeIndex === 2 ? 3 : 2}
                    dot={{ r: activeIndex === 2 ? 5 : 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <CategoryList 
              data={lineData} 
              activeIndex={activeIndex} 
              onHover={setActiveIndex}
              darkMode={darkMode}
            />
          </>
        )}
      </div>
    </div>
  );
}