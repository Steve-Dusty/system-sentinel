'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsSubmitting(false);
      return;
    }

    try {
      await apiClient.register({
        email: formData.email,
        username: formData.username,
        full_name: formData.full_name || undefined,
        password: formData.password,
      });

      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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

  if (success) {
    return (
      <main className="flex items-center justify-center h-screen flex-col">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-green-400">Account Created!</h1>
          <p className="text-gray-400 mb-4">Your account has been successfully created.</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen py-8 flex-col">
      <h1 className="text-4xl font-bold mb-8">Create Account</h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        {error && (
          <div className="w-full px-4 py-2 mb-4 text-red-400 bg-red-900/20 border border-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        
        <input
          type="text"
          name="full_name"
          placeholder="Full Name (optional)"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          className="w-full px-4 py-2 mb-4 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-6 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 font-bold text-white bg-sky-600 rounded-md hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/" className="text-sky-400 hover:text-sky-300 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}
