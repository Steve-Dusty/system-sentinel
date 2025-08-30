'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrafficDataPoint {
  time: string;
  rps: number;
}

interface TrafficChartProps {
  data: TrafficDataPoint[];
}

export default function TrafficChart({ data }: TrafficChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-gray-300 text-sm">{`Time: ${label}`}</p>
          <p className="text-blue-400 text-sm">{`RPS: ${payload[0].value.toFixed(1)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={256}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          label={{ value: 'Requests/Second', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="rps" 
          fill="#3B82F6" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
