'use client';

import { MonitoredService } from '../types';
import { useRouter } from 'next/navigation';

interface SystemsOverviewProps {
  services: MonitoredService[];
}

export default function SystemsOverview({ services }: SystemsOverviewProps) {
  const router = useRouter();
  if (services.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-400">No services monitored yet</p>
        <p className="text-gray-500 text-sm">Add your first service to start monitoring</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'offline':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'warning':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'offline':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <div
          key={service.id}
          onClick={() => router.push(`/dashboard/${service.id}`)}
          className="bg-gray-900 p-4 rounded-lg border border-gray-800 hover:border-gray-700 hover:bg-gray-900/50 transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-100 group-hover:text-white transition-colors">
                {service.name}
              </h4>
              <p className="text-sm text-gray-400">
                {service.ip}:{service.port}
              </p>
            </div>
            <div className={`flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(service.status)}`}>
              {getStatusIcon(service.status)}
              <span className="ml-1 capitalize">{service.status}</span>
            </div>
          </div>

          {service.description && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {service.description}
            </p>
          )}

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-gray-400">Response</div>
              <div className="text-gray-200 font-medium">{service.metrics.responseTime.toFixed(0)}ms</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Uptime</div>
              <div className="text-gray-200 font-medium">{service.metrics.uptime.toFixed(1)}%</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Errors</div>
              <div className="text-gray-200 font-medium">{service.metrics.errors}</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Last check: {service.lastCheck.toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
}
