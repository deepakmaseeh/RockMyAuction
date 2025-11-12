'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold sm:text-3xl">Auction Management</h1>
              <p className="text-sm text-gray-400">
                Manage catalog drafts, scheduled drops, and live auctions from one place.
              </p>
            </div>
            <Link
              href="/admin/auctions/new"
              className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              + New Auction
            </Link>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/5 bg-black/20 py-12 text-center text-sm text-gray-400">
              Loading auctions…
            </div>
          ) : auctions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 py-12 text-center text-sm text-gray-400">
              No auctions found. Create your first auction to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {auctions.map((auction) => (
                <Link
                  key={auction._id}
                  href={`/admin/auctions/${auction._id}`}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-orange-400/60 hover:bg-white/10"
                >
                  <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        auction.status === 'live'
                          ? 'bg-green-600/20 text-green-300'
                          : auction.status === 'scheduled'
                          ? 'bg-blue-600/20 text-blue-300'
                          : auction.status === 'closed'
                          ? 'bg-gray-600/20 text-gray-300'
                          : 'bg-gray-700/30 text-gray-300'
                      }`}
                    >
                      {auction.status || 'draft'}
                    </span>
                    <span>
                      {auction.startAt
                        ? new Date(auction.startAt).toLocaleDateString(undefined, {
                            dateStyle: 'medium',
                          })
                        : 'No start date'}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-white transition group-hover:text-orange-300 sm:text-xl">
                    {auction.title}
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    {auction.description ? `${auction.description.substring(0, 120)}…` : 'No description provided yet.'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}








