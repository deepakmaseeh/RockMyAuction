'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LotForm from '@/components/admin/LotForm';

export default function NewLotPage({ params }) {
  const router = useRouter();
  const [auctionId, setAuctionId] = useState(null);

  useEffect(() => {
    // Get auctionId from URL or params
    const pathParts = window.location.pathname.split('/');
    const idIndex = pathParts.indexOf('auctions') + 1;
    if (idIndex > 0 && pathParts[idIndex]) {
      setAuctionId(pathParts[idIndex]);
    }
  }, []);

  const handleSubmit = async (lotData, intent = 'save') => {
    const res = await fetch(`/api/admin/auctions/${auctionId}/lots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lotData),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to create lot');
    }

    if (intent === 'save') {
      router.push(`/admin/auctions/${auctionId}`);
    } else if (intent === 'saveNext') {
      router.replace(`/admin/auctions/${auctionId}/lots/new`);
    }

    return data.data;
  };

  if (!auctionId) {
    return <div className="min-h-screen bg-gray-900 text-white p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Lot</h1>
        <LotForm onSubmit={handleSubmit} onCancel={() => router.back()} />
      </div>
    </div>
  );
}








