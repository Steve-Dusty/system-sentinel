'use client';

import { MonitoredService } from '../types';

interface ServiceSidebarProps {
  selectedService: MonitoredService | null;
  onClose: () => void;
}

export default function ServiceSidebar({ selectedService, onClose }: ServiceSidebarProps) {
  if (!selectedService) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-400';
      case 'offline':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'offline':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="w-96 bg-gray-950 border-l border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-100">{selectedService.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-400 text-sm">
            <span className="font-medium">IP:</span> {selectedService.ip}
          </p>
          <p className="text-gray-400 text-sm">
            <span className="font-medium">Port:</span> {selectedService.port}
          </p>
          {selectedService.description && (
            <p className="text-gray-400 text-sm">
              <span className="font-medium">Description:</span> {selectedService.description}
            </p>
          )}
        </div>

        <div className="flex items-center mt-4">
          <div className={`flex items-center ${getStatusColor(selectedService.status)}`}>
            {getStatusIcon(selectedService.status)}
            <span className="ml-2 font-medium capitalize">{selectedService.status}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Real-time Metrics */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-100">Real-time Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <div className="text-2xl font-bold text-gray-100">
                {selectedService.metrics.responseTime.toFixed(0)}
              </div>
              <div className="text-sm text-gray-400">Response Time (ms)</div>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <div className="text-2xl font-bold text-gray-100">
                {selectedService.metrics.uptime.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <div className="text-2xl font-bold text-gray-100">
                {selectedService.metrics.errors}
              </div>
              <div className="text-sm text-gray-400">Errors (24h)</div>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <div className="text-2xl font-bold text-gray-100">
                {new Date(selectedService.lastCheck).toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-400">Last Check</div>
            </div>
          </div>
        </div>

        {/* Response Time Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-100">Response Time Trend</h3>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 h-32 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm">Chart placeholder</p>
              <p className="text-xs">shadcn/ui charts will be integrated here</p>
            </div>
          </div>
        </div>

        {/* Anomaly Detection */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-100">Anomaly Detection</h3>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Status</span>
              <span className="text-green-400 text-sm font-medium">Normal</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Last Anomaly</span>
              <span className="text-gray-300 text-sm">None detected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Threshold</span>
              <span className="text-gray-300 text-sm">500ms</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-100">Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors">
              Test Connection
            </button>
            <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">
              View Logs
            </button>
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              Remove Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
