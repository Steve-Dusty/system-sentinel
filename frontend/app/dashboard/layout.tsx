import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <nav className="w-60 bg-gray-950 border-r border-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-10">Sentinel Nav</h2>
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard" className="text-gray-300 hover:text-white">
              Dashboard
            </Link>
          </li>
          {/* Add more links here later */}
        </ul>
      </nav>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}