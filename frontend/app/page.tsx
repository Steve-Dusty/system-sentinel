'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  // Redirect to dashboard immediately
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="text-xl">Redirecting to dashboard...</div>
    </main>
  );
}
