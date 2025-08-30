'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SaturationDataPoint {
  time: string;
  cpu: number;
  memory: number;
}

interface SaturationChartProps {
  data: SaturationDataPoint[];
}

export default function SaturationChart({ data }: SaturationChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-gray-300 text-sm">{`Time: ${label}`}</p>
          <p className="text-orange-400 text-sm">{`CPU: ${payload[0].value.toFixed(1)}%`}</p>
          <p className="text-purple-400 text-sm">{`Memory: ${payload[1].value.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={256}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          tickFormatter={(value) => `${value}%`}
          label={{ value: 'Usage (%)', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="cpu" 
          stroke="#F97316" 
          strokeWidth={2}
          dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#F97316', strokeWidth: 2 }}
          name="CPU"
        />
        <Line 
          type="monotone" 
          dataKey="memory" 
          stroke="#A855F7" 
          strokeWidth={2}
          dot={{ fill: '#A855F7', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#A855F7', strokeWidth: 2 }}
          name="Memory"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
