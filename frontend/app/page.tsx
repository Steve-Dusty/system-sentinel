'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // In a real app, perform authentication here
    router.push('/dashboard');
  };

  return (
    <main className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-4xl font-bold mb-4">System-Sentinel</h1>
      <div className="w-full max-w-xs">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-4 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 font-bold text-white bg-sky-600 rounded-md hover:bg-sky-700 transition-colors"
        >
          Sign In
        </button>
      </div>
    </main>
  );
}