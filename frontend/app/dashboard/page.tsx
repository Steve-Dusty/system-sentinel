'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

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
    <div className="min-h-screen p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user.full_name || user.username}!</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* User Info Card */}
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

        {/* System Status */}
        <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-400">API Status:</span> <span className="text-green-400">Connected</span></p>
            <p><span className="text-gray-400">Database:</span> <span className="text-green-400">Online</span></p>
            <p><span className="text-gray-400">Auth:</span> <span className="text-green-400">Active</span></p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 text-sm bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors">
              View Logs
            </button>
            <button className="w-full px-3 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors">
              Settings
            </button>
            {user.is_superuser && (
              <button className="w-full px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                Admin Panel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-950 p-6 rounded-lg border border-gray-800">
        <h3 className="text-lg font-semibold mb-4">System Monitoring</h3>
        <p className="text-gray-400">Live metrics and monitoring data will be displayed here.</p>
      </div>
    </div>
  );
}