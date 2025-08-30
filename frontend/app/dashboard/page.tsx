'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AddServiceForm from './components/AddServiceForm';
import SystemsOverview from './components/SystemsOverview';
import { MonitoredService } from './types';
import mockData from './mockData.json';

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<MonitoredService[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load mock services on component mount
  useEffect(() => {
    const mockServices = mockData.services.map(service => ({
      ...service,
      lastCheck: new Date(service.lastCheck),
      status: service.status as 'online' | 'offline' | 'warning',
    }));
    setServices(mockServices);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleAddService = (newService: { name: string; ip: string; port: number; description?: string }) => {
    const newId = (services.length + 1).toString();
    
    // Create consistent service data with default values
    const service: MonitoredService = {
      ...newService,
      id: newId,
      lastCheck: new Date(),
      metrics: {
        responseTime: 150, // Default values matching JSON structure
        uptime: 99.8,
        errors: 0,
      },
      status: 'online' as const,
    };

    // Add to services state
    setServices([...services, service]);
    setShowAddForm(false);
  };



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect
  }

  return (
    <div className="flex h-screen">
      {/* Main Dashboard */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-950 border-b border-gray-800 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">System-Sentinel Dashboard</h1>
              <p className="text-gray-400 mt-1">Welcome back, {user.full_name || user.username}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* User Information Card */}
            <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">User Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-400">Email:</span> {user.email}</p>
                <p><span className="text-gray-400">Username:</span> {user.username}</p>
                <p><span className="text-gray-400">Status:</span> 
                  <span className={`ml-1 ${user.is_active ? 'text-green-400' : 'text-red-400'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
                <p><span className="text-gray-400">Role:</span> 
                  <span className={`ml-1 ${user.is_superuser ? 'text-blue-400' : 'text-gray-300'}`}>
                    {user.is_superuser ? 'Admin' : 'User'}
                  </span>
                </p>
                <p><span className="text-gray-400">Joined:</span> {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {/* System Status Card */}
            <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">System Status</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-400">API Status:</span> <span className="text-green-400">Connected</span></p>
                <p><span className="text-gray-400">Database:</span> <span className="text-green-400">Online</span></p>
                <p><span className="text-gray-400">Auth:</span> <span className="text-green-400">Active</span></p>
                <p><span className="text-gray-400">Services:</span> <span className="text-blue-400">{services.length} Monitored</span></p>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
                >
                  Add New Service
                </button>
                <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">
                  View System Logs
                </button>
              </div>
            </div>

            {/* Systems Overview Card */}
            <div className="bg-gray-950 p-6 rounded-lg border border-gray-800 lg:col-span-3">
              <h3 className="text-lg font-semibold mb-4">Systems Overview</h3>
              <SystemsOverview 
                services={services} 
              />
            </div>
          </div>
        </main>
      </div>



      {/* Add Service Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-950 p-6 rounded-lg border border-gray-800 w-full max-w-md">
            <AddServiceForm 
              onSubmit={handleAddService}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}