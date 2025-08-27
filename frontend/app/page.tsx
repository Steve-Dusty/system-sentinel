'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from './contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(formData.username, formData.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <main className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-4xl font-bold mb-4">System-Sentinel</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        {error && (
          <div className="w-full px-4 py-2 mb-4 text-red-400 bg-red-900/20 border border-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 font-bold text-white bg-sky-600 rounded-md hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>

        <div className="text-center mt-4">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-sky-400 hover:text-sky-300 transition-colors">
              Sign up here
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}