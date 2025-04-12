import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { formatIndianCurrency } from '../../utils/currencyFormatter';

const COLORS = [
  '#6366F1', '#EC4899', '#10B981', '#F59E0B', 
  '#3B82F6', '#F97316', '#8B5CF6', '#EF4444',
  '#14B8A6', '#64748B'
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ 
  cx, 
  cy, 
  midAngle, 
  outerRadius, 
  percent, 
  name, 
  value 
}) => {
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  const textAnchor = Math.cos(-midAngle * RADIAN) > 0 ? 'start' : 'end';

  return (
    <g>
      <line
        x1={cx + (outerRadius * 0.9) * Math.cos(-midAngle * RADIAN)}
        y1={cy + (outerRadius * 0.9) * Math.sin(-midAngle * RADIAN)}
        x2={x}
        y2={y}
        stroke="#94a3b8"
        strokeWidth={1}
      />
      <text
        x={x}
        y={y}
        fill={textAnchor === 'start' ? '#1e293b' : '#1e293b'}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontWeight="bold"
        fontSize={12}
      >
        {name}
      </text>
      <text
        x={x}
        y={y + 15}
        fill={textAnchor === 'start' ? '#475569' : '#475569'}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize={10}
      >
        {`${(percent * 100).toFixed(1)}% • ${formatIndianCurrency(value)}`}
      </text>
    </g>
  );
};

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload
  } = props;

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 10}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  );
};

const CategoryList = ({ data, activeIndex, onHover, darkMode }) => {
  return (
    <div className="flex flex-col  shadow p-3 justify-between rounded-lg shadow-gray-400">
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
            className="w-4 h-4 rounded-full mr-2" 
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
            <span className={`text-sm mr-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              {entry.category}
            </span>
            <span className={`ml-auto text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {entry.percentage.toFixed(1)}%
            </span>
        </div>
      ))}
    </div>
  );
};

export default function PieChartComponent({ data, title, darkMode }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const total = data?.reduce((sum, curr) => sum + curr.amount, 0) || 0;
  const formattedData = data?.map(item => ({
    ...item,
    percentage: ((item.amount / total) * 100)
  })) || [];

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}  transition-all`}>
      <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {title}
      </h3>
      
      <div className="h-[30rem] flex flex-col gap-2 md:flex-row">
        {formattedData.length === 0 ? (
          <div className={`flex-1 flex items-center justify-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No data available
          </div>
        ) : (
          <>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formattedData}
                    cx="40%"
                    cy="50%"
                    outerRadius="75%"
                    paddingAngle={2}
                    dataKey="amount"
                    nameKey="category"
                    label={renderCustomizedLabel}
                    labelLine={false}
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                    animationDuration={500}
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                  >
                    {formattedData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        stroke={darkMode ? '#fff' : '#000'}
                        strokeWidth={activeIndex === index ? 3 : 1}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [formatIndianCurrency(value), 'Amount']}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{
                      backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                      borderColor: darkMode ? '#374151' : '#E5E7EB',
                      borderRadius: '0.5rem',
                      color: darkMode ? '#fff' : '#000000',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <CategoryList 
              data={formattedData} 
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