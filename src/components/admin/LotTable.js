'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LotTable({ lots, auctionId, onRefresh }) {
  const [selectedLots, setSelectedLots] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  const handleBulkAction = async () => {
    if (!bulkAction || selectedLots.length === 0) return;

    try {
      const res = await fetch('/api/admin/lots/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: bulkAction,
          lotIds: selectedLots
        })
      });

      const data = await res.json();
      if (data.success) {
        alert(`Bulk ${bulkAction} completed: ${data.modifiedCount} lots updated`);
        setSelectedLots([]);
        setBulkAction('');
        onRefresh();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Error performing bulk action');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {selectedLots.length > 0 && (
        <div className="bg-blue-900 p-4 flex items-center gap-4">
          <span className="text-sm">{selectedLots.length} lot(s) selected</span>
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="bg-gray-700 text-white px-3 py-1 rounded"
          >
            <option value="">Select action...</option>
            <option value="publish">Publish</option>
            <option value="unpublish">Unpublish</option>
            <option value="feature">Feature</option>
            <option value="unfeature">Unfeature</option>
          </select>
          <button
            onClick={handleBulkAction}
            disabled={!bulkAction}
            className="bg-orange-600 hover:bg-orange-700 px-4 py-1 rounded disabled:opacity-50"
          >
            Apply
          </button>
          <button
            onClick={() => setSelectedLots([])}
            className="text-gray-400 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedLots.length === lots.length && lots.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedLots(lots.map(l => l._id));
                    } else {
                      setSelectedLots([]);
                    }
                  }}
                />
              </th>
              <th className="p-3 text-left">Lot #</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Estimate</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lots.map((lot) => (
              <tr key={lot._id} className="border-t border-gray-700 hover:bg-gray-700">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedLots.includes(lot._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLots([...selectedLots, lot._id]);
                      } else {
                        setSelectedLots(selectedLots.filter(id => id !== lot._id));
                      }
                    }}
                  />
                </td>
                <td className="p-3 font-medium">{lot.lotNumber}</td>
                <td className="p-3">{lot.title}</td>
                <td className="p-3 text-gray-400">{lot.category || '-'}</td>
                <td className="p-3">
                  ${lot.estimateLow?.toLocaleString() || 0} - ${lot.estimateHigh?.toLocaleString() || 0}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    lot.status === 'published' ? 'bg-green-600' :
                    lot.status === 'sold' ? 'bg-blue-600' :
                    lot.status === 'passed' ? 'bg-red-600' :
                    'bg-gray-600'
                  }`}>
                    {lot.status}
                  </span>
                  {lot.featured && (
                    <span className="ml-2 px-2 py-1 bg-yellow-600 rounded text-xs">⭐</span>
                  )}
                </td>
                <td className="p-3">
                  <Link
                    href={`/admin/auctions/${auctionId}/lots/${lot._id}/edit`}
                    className="text-orange-400 hover:text-orange-300 mr-3"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lots.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No lots found. Create your first lot to get started.
        </div>
      )}
    </div>
  );
}






