'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import LotTable from '@/components/admin/LotTable';
import CSVImportWizard from '@/components/admin/CSVImportWizard';

export default function AdminAuctionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const auctionId = params.id;
  
  const [auction, setAuction] = useState(null);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    if (auctionId) {
      fetchAuction();
      fetchLots();
    }
  }, [auctionId]);

  const fetchAuction = async () => {
    try {
      const res = await fetch(`/api/admin/auctions/${auctionId}`);
      const data = await res.json();
      if (data.success) {
        setAuction(data.data);
      }
    } catch (error) {
      console.error('Error fetching auction:', error);
    }
  };

  const fetchLots = async () => {
    try {
      const res = await fetch(`/api/admin/auctions/${auctionId}/lots`);
      const data = await res.json();
      if (data.success) {
        setLots(data.data);
      }
    } catch (error) {
      console.error('Error fetching lots:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white p-6">Loading...</div>;
  }

  if (!auction) {
    return <div className="min-h-screen bg-gray-900 text-white p-6">Auction not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white mb-4"
          >
            ← Back to Auctions
          </button>
          <h1 className="text-3xl font-bold mb-2">{auction.title}</h1>
          <p className="text-gray-400">{auction.description}</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => router.push(`/admin/auctions/${auctionId}/lots/new`)}
            className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg font-medium"
          >
            + New Lot
          </button>
          <button
            onClick={() => setShowImport(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
          >
            Import CSV
          </button>
          <a
            href={`/api/admin/lots/export?auctionId=${auctionId}`}
            download
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium"
          >
            Export CSV
          </a>
        </div>

        <LotTable
          lots={lots}
          auctionId={auctionId}
          onRefresh={fetchLots}
        />

        {showImport && (
          <CSVImportWizard
            auctionId={auctionId}
            onClose={() => setShowImport(false)}
            onSuccess={() => {
              setShowImport(false);
              fetchLots();
            }}
          />
        )}
      </div>
    </div>
  );
}





