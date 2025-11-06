'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminAuctionsPage() {
  const router = useRouter();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const res = await fetch('/api/admin/auctions');
      const data = await res.json();
      if (data.success) {
        setAuctions(data.data);
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Auction Management</h1>
          <Link
            href="/admin/auctions/new"
            className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg font-medium"
          >
            + New Auction
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No auctions found. Create your first auction to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {auctions.map((auction) => (
              <Link
                key={auction._id}
                href={`/admin/auctions/${auction._id}`}
                className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition"
              >
                <h2 className="text-xl font-semibold mb-2">{auction.title}</h2>
                <p className="text-gray-400 text-sm mb-4">
                  {auction.description?.substring(0, 100)}...
                </p>
                <div className="flex justify-between text-sm">
                  <span className={`px-2 py-1 rounded ${
                    auction.status === 'live' ? 'bg-green-600' :
                    auction.status === 'scheduled' ? 'bg-blue-600' :
                    auction.status === 'closed' ? 'bg-gray-600' :
                    'bg-gray-700'
                  }`}>
                    {auction.status}
                  </span>
                  <span className="text-gray-400">
                    {new Date(auction.startAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}





