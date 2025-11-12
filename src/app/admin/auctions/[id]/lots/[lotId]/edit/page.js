'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LotForm from '@/components/admin/LotForm';

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export default function EditLotPage() {
  const params = useParams();
  const router = useRouter();
  const auctionId = params.id;
  const lotId = params.lotId;

  const [loading, setLoading] = useState(true);
  const [lot, setLot] = useState(null);
  const [lotOrder, setLotOrder] = useState([]);

  const lotIndex = useMemo(
    () => lotOrder.findIndex((entry) => entry._id === lotId),
    [lotOrder, lotId]
  );

  const navigation = useMemo(
    () => ({
      hasPrevious: lotIndex > 0,
      hasNext: lotIndex >= 0 && lotIndex < lotOrder.length - 1,
    }),
    [lotIndex, lotOrder.length]
  );

  useEffect(() => {
    if (!auctionId || !lotId) return;

    const load = async () => {
      setLoading(true);
      try {
        const [lotResponse, listResponse] = await Promise.all([
          fetchJSON(`/api/admin/lots/${lotId}`),
          fetchJSON(`/api/admin/auctions/${auctionId}/lots?sort=sequence&order=asc`),
        ]);
        setLot(lotResponse.data);
        setLotOrder(listResponse.data);
      } catch (error) {
        console.error('Failed to load lot', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [auctionId, lotId]);

  const handleSubmit = async (payload, intent = 'save') => {
    const data = await fetchJSON(`/api/admin/lots/${lotId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (intent === 'savePrevious' && navigation.hasPrevious) {
      const prevLotId = lotOrder[lotIndex - 1]?._id;
      if (prevLotId) {
        router.replace(`/admin/auctions/${auctionId}/lots/${prevLotId}/edit`);
      }
    } else if (intent === 'saveNext' && navigation.hasNext) {
      const nextLotId = lotOrder[lotIndex + 1]?._id;
      if (nextLotId) {
        router.replace(`/admin/auctions/${auctionId}/lots/${nextLotId}/edit`);
      }
    } else if (intent === 'save') {
      setLot(data.data);
    }

    return data.data;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-5xl mx-auto">Loading lot...</div>
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-400 hover:text-white mb-4"
          >
            ← Back
          </button>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            Lot not found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push(`/admin/auctions/${auctionId}`)}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back to lots
          </button>
          <div className="text-sm text-gray-400">
            Lot {lot.lotNumber} • {lot.title}
          </div>
        </div>
        <LotForm lot={lot} onSubmit={handleSubmit} onCancel={() => router.back()} navigation={navigation} />
      </div>
    </div>
  );
}

