'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface LatencyDataPoint {
  time: string;
  latency: number;
  predicted: number;
  anomaly?: boolean;
}

interface LatencyChartProps {
  data: LatencyDataPoint[];
}

export default function LatencyChart({ data }: LatencyChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-gray-300 text-sm">{`Time: ${label}`}</p>
          <p className="text-blue-400 text-sm">{`Latency: ${payload[0].value}ms`}</p>
          <p className="text-green-400 text-sm">{`Predicted: ${payload[1].value}ms`}</p>
          {payload[0].payload.anomaly && (
            <p className="text-red-400 text-sm font-bold">🚨 Anomaly Detected</p>
          )}
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
          label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={200} stroke="#EF4444" strokeDasharray="3 3" label="Target" />
        <Line 
          type="monotone" 
          dataKey="latency" 
          stroke="#3B82F6" 
          strokeWidth={2}
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="predicted" 
          stroke="#10B981" 
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
