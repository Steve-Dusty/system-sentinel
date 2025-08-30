'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { MonitoredService } from '../types';
import LatencyChart from '../components/charts/LatencyChart';
import ErrorRateChart from '../components/charts/ErrorRateChart';
import TrafficChart from '../components/charts/TrafficChart';
import SaturationChart from '../components/charts/SaturationChart';
import mockData from '../mockData.json';

interface ServiceMetrics {
  app: string;
  ts: string;
  rps: number;
  latency_p95_ms: number;
  error_rate: number;
  cpu_pct: number;
  mem_pct: number;
  availability_30d: number;
  data_freshness_s: number;
  last_anomaly?: {
    ts: string;
    z: number;
    severity: 'low' | 'medium' | 'high';
  };
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [service, setService] = useState<MonitoredService | null>(null);
  const [metrics, setMetrics] = useState<ServiceMetrics | null>(null);
  const [chartData, setChartData] = useState({
    latency: [] as any[],
    errorRate: [] as any[],
    traffic: [] as any[],
    saturation: [] as any[],
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Load mock data from JSON file
  useEffect(() => {
    if (params.serviceId) {
      const serviceId = params.serviceId as string;
      
      // Find service in mock data
      const mockService = mockData.services.find(s => s.id === serviceId);
      const mockMetrics = mockData.serviceMetrics[serviceId as keyof typeof mockData.serviceMetrics];
      const mockChartData = mockData.chartData[serviceId as keyof typeof mockData.chartData];

      if (mockService && mockMetrics && mockChartData) {
        setService({
          ...mockService,
          lastCheck: new Date(mockService.lastCheck),
          status: mockService.status as 'online' | 'offline' | 'warning',
        });
        setMetrics({
          ...mockMetrics,
          last_anomaly: mockMetrics.last_anomaly ? {
            ...mockMetrics.last_anomaly,
            severity: mockMetrics.last_anomaly.severity as 'low' | 'medium' | 'high'
          } : undefined
        });
        setChartData(mockChartData);
      } else {
        // Handle dynamically added services with default data
        const defaultService: MonitoredService = {
          id: serviceId,
          name: `Service ${serviceId}`,
          ip: "192.168.1.100",
          port: 8080,
          description: "Dynamically added service",
          status: 'online',
          lastCheck: new Date(),
          metrics: {
            responseTime: 150,
            uptime: 99.8,
            errors: 0,
          },
        };

        const defaultMetrics: ServiceMetrics = {
          app: `service-${serviceId}`,
          ts: new Date().toISOString(),
          rps: 10.0,
          latency_p95_ms: 150,
          error_rate: 0.001,
          cpu_pct: 45.0,
          mem_pct: 60.0,
          availability_30d: 0.9990,
          data_freshness_s: 5,
          last_anomaly: undefined,
        };

        // Generate default chart data
        const now = new Date();
        const defaultChartData = {
          latency: [] as any[],
          errorRate: [] as any[],
          traffic: [] as any[],
          saturation: [] as any[],
        };

        for (let i = 8; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 5 * 60 * 1000);
          
          defaultChartData.latency.push({
            time: time.toISOString(),
            latency: 150 + Math.random() * 20,
            predicted: 145 + Math.random() * 10,
            anomaly: false,
          });

          defaultChartData.errorRate.push({
            time: time.toISOString(),
            errorRate: 0.001 + Math.random() * 0.005,
          });

          defaultChartData.traffic.push({
            time: time.toISOString(),
            rps: 10 + Math.random() * 5,
          });

          defaultChartData.saturation.push({
            time: time.toISOString(),
            cpu: 45 + Math.random() * 10,
            memory: 60 + Math.random() * 10,
          });
        }

        setService(defaultService);
        setMetrics(defaultMetrics);
        setChartData(defaultChartData);
      }
    }
  }, [params.serviceId]);

  // Update document title when service is loaded
  useEffect(() => {
    if (service) {
      document.title = `${service.name} - System-Sentinel`;
    } else {
      document.title = 'System-Sentinel';
    }
  }, [service]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !service || !metrics) {
    return null;
  }

  const getAvailabilityStatus = (availability: number) => {
    if (availability >= 0.999) return { status: 'excellent', color: 'text-green-400', bg: 'bg-green-400/10' };
    if (availability >= 0.99) return { status: 'good', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    return { status: 'poor', color: 'text-red-400', bg: 'bg-red-400/10' };
  };

  const getAnomalyColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const availabilityStatus = getAvailabilityStatus(metrics.availability_30d);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-100">{service.name}</h1>
              <p className="text-gray-400">{service.ip}:{service.port}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center px-3 py-1 rounded-full text-sm border text-green-400 bg-green-400/10 border-green-400/20">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Online
            </div>
            <div className="text-sm text-gray-400">
              Live • {metrics.data_freshness_s}s ago
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Golden Signals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {/* Latency p95 */}
          <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Latency p95</h3>
              <span className="text-xs text-gray-500">ms</span>
            </div>
            <div className="text-2xl font-bold text-gray-100">{metrics.latency_p95_ms}</div>
            <div className="text-xs text-gray-500 mt-1">Target: &lt;200ms</div>
          </div>

          {/* Traffic (RPS) */}
          <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Traffic</h3>
              <span className="text-xs text-gray-500">RPS</span>
            </div>
            <div className="text-2xl font-bold text-gray-100">{metrics.rps.toFixed(1)}</div>
            <div className="text-xs text-gray-500 mt-1">Requests/second</div>
          </div>

          {/* Error Rate */}
          <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Error Rate</h3>
              <span className="text-xs text-gray-500">%</span>
            </div>
            <div className="text-2xl font-bold text-gray-100">{(metrics.error_rate * 100).toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-1">5xx / total</div>
          </div>

          {/* CPU Saturation */}
          <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">CPU</h3>
              <span className="text-xs text-gray-500">%</span>
            </div>
            <div className="text-2xl font-bold text-gray-100">{metrics.cpu_pct.toFixed(1)}</div>
            <div className="text-xs text-gray-500 mt-1">Saturation</div>
          </div>

          {/* Memory Saturation */}
          <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Memory</h3>
              <span className="text-xs text-gray-500">%</span>
            </div>
            <div className="text-2xl font-bold text-gray-100">{metrics.mem_pct.toFixed(1)}</div>
            <div className="text-xs text-gray-500 mt-1">Saturation</div>
          </div>

          {/* Availability */}
          <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Availability</h3>
              <span className="text-xs text-gray-500">30d</span>
            </div>
            <div className="text-2xl font-bold text-gray-100">{(metrics.availability_30d * 100).toFixed(2)}%</div>
            <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${availabilityStatus.bg} ${availabilityStatus.color}`}>
              {availabilityStatus.status}
            </div>
          </div>

          {/* Data Freshness */}
          <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Freshness</h3>
              <span className="text-xs text-gray-500">s</span>
            </div>
            <div className="text-2xl font-bold text-gray-100">{metrics.data_freshness_s}</div>
            <div className="text-xs text-gray-500 mt-1">
              {metrics.data_freshness_s > 15 ? 'Stale' : 'Live'}
            </div>
          </div>

          {/* Anomaly Status */}
          <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Anomaly</h3>
            </div>
            {metrics.last_anomaly ? (
              <div>
                <div className={`text-sm px-2 py-1 rounded-full inline-block border ${getAnomalyColor(metrics.last_anomaly.severity)}`}>
                  {metrics.last_anomaly.severity}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  z-score: {metrics.last_anomaly.z.toFixed(1)}
                </div>
              </div>
            ) : (
              <div className="text-sm text-green-400">None detected</div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latency Chart */}
          <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Latency Trend (p95)</h3>
            <LatencyChart data={chartData.latency} />
          </div>

          {/* Error Rate Chart */}
          <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Error Rate Trend</h3>
            <ErrorRateChart data={chartData.errorRate} />
          </div>

          {/* RPS Trend */}
          <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Traffic Trend (RPS)</h3>
            <TrafficChart data={chartData.traffic} />
          </div>

          {/* Saturation Trend */}
          <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Saturation Trend</h3>
            <SaturationChart data={chartData.saturation} />
          </div>
        </div>
      </main>
    </div>
  );
}
