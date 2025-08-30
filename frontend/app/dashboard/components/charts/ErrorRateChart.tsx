'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ErrorRateDataPoint {
  time: string;
  errorRate: number;
}

interface ErrorRateChartProps {
  data: ErrorRateDataPoint[];
}

export default function ErrorRateChart({ data }: ErrorRateChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-gray-300 text-sm">{`Time: ${label}`}</p>
          <p className="text-red-400 text-sm">{`Error Rate: ${(payload[0].value * 100).toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={256}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="time" 
          stroke="#9CA3AF" 
          fontSize={12}
          tickFormatter={(value) => new Date(value).toLocaleTimeString()}
        />
        <YAxis 
          stroke="#9CA3AF" 
          fontSize={12}
          tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
          label={{ value: 'Error Rate (%)', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="errorRate" 
          stroke="#EF4444" 
          fill="#EF4444"
          fillOpacity={0.3}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
