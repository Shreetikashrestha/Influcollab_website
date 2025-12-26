'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [type, setType] = useState<string>('influencer');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    setType(params.get('type') ?? 'influencer');
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-gray-600">You are signed in as <strong className="capitalize">{type}</strong></p>
          </div>
          <div>
            <button onClick={() => router.push('/')} className="px-4 py-2 border rounded">Go to Home</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-sm text-gray-500">Active campaigns</p>
            <p className="text-2xl font-semibold">8</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-sm text-gray-500">Messages</p>
            <p className="text-2xl font-semibold">3</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-sm text-gray-500">Saved</p>
            <p className="text-2xl font-semibold">5</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-2">Quick actions</h2>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-purple-600 text-white rounded">Create campaign</button>
            <button className="px-4 py-2 border rounded">Discover influencers</button>
          </div>
        </div>
      </div>
    </div>
  );
}
