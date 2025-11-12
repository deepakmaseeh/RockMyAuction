'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const COLUMN_DEFINITIONS = [
  { key: 'lotNumber', label: 'Lot #', width: 'w-32' },
  { key: 'title', label: 'Title', width: 'min-w-[240px]' },
  { key: 'category', label: 'Category', width: 'w-40' },
  { key: 'companyCategory', label: 'Company Category', width: 'w-44' },
  { key: 'estimate', label: 'Estimate', width: 'w-40' },
  { key: 'status', label: 'Status', width: 'w-40' },
  { key: 'requiresApproval', label: 'Approval', width: 'w-36' },
  { key: 'sequence', label: 'Sequence', width: 'w-32' },
];

export default function LotTable({
  lots,
  auctionId,
  selectedLotIds,
  onSelectionChange,
  onReorder,
  onBulkAction,
  onOpenBulkEdit,
  onOpenRenumber,
  onTransferIntent,
  onOpenApprovalQueue,
}) {
  const [localLots, setLocalLots] = useState(lots);
  const [draggingId, setDraggingId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bulkAction, setBulkAction] = useState('');
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(() =>
    COLUMN_DEFINITIONS.reduce((acc, column) => {
      acc[column.key] = true;
      return acc;
    }, {})
  );

  useEffect(() => {
    setLocalLots(lots);
  }, [lots]);

  const filteredLots = useMemo(() => {
    return localLots
      .filter((lot) => {
        const matchesStatus =
          statusFilter === 'all' || lot.status === statusFilter || (statusFilter === 'pending' && lot.approval?.status === 'pending');
        if (!matchesStatus) return false;

        if (!search.trim()) {
          return true;
        }

        const q = search.toLowerCase();
        return (
          lot.lotNumber?.toLowerCase().includes(q) ||
          lot.title?.toLowerCase().includes(q) ||
          lot.category?.toLowerCase().includes(q) ||
          lot.companyCategory?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.sequence - b.sequence);
  }, [localLots, search, statusFilter]);

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(filteredLots.map((lot) => lot._id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectLot = (lotId, checked) => {
    if (checked) {
      onSelectionChange(Array.from(new Set([...selectedLotIds, lotId])));
    } else {
      onSelectionChange(selectedLotIds.filter((id) => id !== lotId));
    }
  };

  const handleDragStart = (lotId) => {
    setDraggingId(lotId);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (event, targetId) => {
    event.preventDefault();
    if (!draggingId || draggingId === targetId) {
      return;
    }

    const currentOrder = [...localLots];
    const draggedIndex = currentOrder.findIndex((lot) => lot._id === draggingId);
    const targetIndex = currentOrder.findIndex((lot) => lot._id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggingId(null);
      return;
    }

    const [draggedLot] = currentOrder.splice(draggedIndex, 1);
    currentOrder.splice(targetIndex, 0, draggedLot);

    setLocalLots(
      currentOrder.map((lot, index) => ({
        ...lot,
        sequence: index + 1,
      }))
    );

    setDraggingId(null);
    try {
      await onReorder(currentOrder.map((lot) => lot._id));
    } catch (error) {
      console.error('Failed to reorder lots', error);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction) return;
    if (bulkAction === 'bulkEdit') {
      onOpenBulkEdit?.();
      setBulkAction('');
      return;
    }
    if (bulkAction === 'renumber') {
      onOpenRenumber?.();
      setBulkAction('');
      return;
    }
    if (bulkAction === 'move' || bulkAction === 'copy') {
      onTransferIntent?.(bulkAction, selectedLotIds);
      setBulkAction('');
      return;
    }
    if (bulkAction === 'openQueue') {
      onOpenApprovalQueue?.();
      setBulkAction('');
      return;
    }
    await onBulkAction(bulkAction, selectedLotIds);
    setBulkAction('');
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="border-b border-gray-700 p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lots..."
              className="bg-gray-900 border border-gray-700 text-sm px-3 py-2 rounded-lg text-white focus:outline-none focus:border-orange-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-sm px-3 py-2 rounded-lg text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending Approval</option>
            <option value="published">Published</option>
            <option value="sold">Sold</option>
            <option value="passed">Passed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColumnMenu((prev) => !prev)}
              className="bg-gray-900 border border-gray-700 text-sm px-3 py-2 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              Columns
            </button>
            {showColumnMenu && (
              <div className="absolute z-10 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-3 space-y-2">
                {COLUMN_DEFINITIONS.map((column) => (
                  <label key={column.key} className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={visibleColumns[column.key]}
                      onChange={() => toggleColumn(column.key)}
                      className="w-4 h-4"
                    />
                    {column.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-sm px-3 py-2 rounded-lg text-white focus:outline-none focus:border-orange-500"
          >
            <option value="">Bulk actions…</option>
            <option value="bulkEdit">Bulk edit field…</option>
            <option value="publish">Publish</option>
            <option value="unpublish">Unpublish</option>
            <option value="feature">Feature</option>
            <option value="unfeature">Unfeature</option>
            <option value="approve">Approve</option>
            <option value="reject">Reject</option>
            <option value="cancel">Cancel</option>
            <option value="mark_sold">Mark sold</option>
            <option value="delete">Delete</option>
            <option value="renumber">Bulk renumber…</option>
            <option value="move">Move to catalog…</option>
            <option value="copy">Copy to catalog…</option>
            <option value="openQueue">Open approval queue</option>
          </select>
          <button
            type="button"
            onClick={handleBulkAction}
            disabled={!bulkAction || selectedLotIds.length === 0}
            className="bg-orange-600 hover:bg-orange-700 text-sm px-4 py-2 rounded-lg font-medium disabled:opacity-40"
          >
            Apply
          </button>
          {selectedLotIds.length > 0 && (
            <span className="text-xs text-gray-400">
              {selectedLotIds.length} lot(s) selected
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-gray-300 uppercase tracking-wide text-xs">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={
                    filteredLots.length > 0 &&
                    selectedLotIds.length === filteredLots.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              {COLUMN_DEFINITIONS.filter((column) => visibleColumns[column.key]).map(
                (column) => (
                  <th key={column.key} className={`px-4 py-3 text-left ${column.width}`}>
                    {column.label}
                  </th>
                )
              )}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredLots.map((lot) => (
              <tr
                key={lot._id}
                draggable
                onDragStart={() => handleDragStart(lot._id)}
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, lot._id)}
                className={`hover:bg-gray-800 ${
                  draggingId === lot._id ? 'bg-gray-800/60' : ''
                }`}
              >
                <td className="px-4 py-3 align-top">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectedLotIds.includes(lot._id)}
                    onChange={(e) => handleSelectLot(lot._id, e.target.checked)}
                  />
                </td>
                {visibleColumns.lotNumber && (
                  <td className="px-4 py-3 align-top font-semibold text-gray-50">
                    <div>#{lot.lotNumber}</div>
                    <div className="text-xs text-gray-500">Seq {lot.sequence}</div>
                  </td>
                )}
                {visibleColumns.title && (
                  <td className="px-4 py-3 align-top">
                    <div className="font-medium text-white">{lot.title}</div>
                    <div className="text-xs text-gray-400 line-clamp-2">
                      {lot.descriptionText || '—'}
                    </div>
                  </td>
                )}
                {visibleColumns.category && (
                  <td className="px-4 py-3 align-top text-gray-300">
                    {lot.category || '—'}
                  </td>
                )}
                {visibleColumns.companyCategory && (
                  <td className="px-4 py-3 align-top text-gray-300">
                    {lot.companyCategory || '—'}
                  </td>
                )}
                {visibleColumns.estimate && (
                  <td className="px-4 py-3 align-top text-gray-200">
                    ${lot.estimateLow?.toLocaleString() || 0} – $
                    {lot.estimateHigh?.toLocaleString() || 0}
                    <div className="text-xs text-gray-500">
                      Reserve ${lot.reservePrice?.toLocaleString() || 0}
                    </div>
                  </td>
                )}
                {visibleColumns.status && (
                  <td className="px-4 py-3 align-top">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        lot.status === 'published'
                          ? 'bg-green-600/20 text-green-300'
                          : lot.status === 'draft'
                          ? 'bg-gray-600/30 text-gray-200'
                          : lot.status === 'sold'
                          ? 'bg-blue-600/20 text-blue-300'
                          : lot.status === 'cancelled'
                          ? 'bg-red-600/20 text-red-300'
                          : 'bg-yellow-600/20 text-yellow-300'
                      }`}
                    >
                      {lot.status}
                    </span>
                    {lot.featured && (
                      <div className="text-xs text-yellow-400 mt-1">Featured</div>
                    )}
                  </td>
                )}
                {visibleColumns.requiresApproval && (
                  <td className="px-4 py-3 align-top text-sm">
                    {lot.requiresApproval || lot.approval?.status === 'pending' ? (
                      <span className="text-yellow-400">Pending</span>
                    ) : (
                      <span className="text-green-400">Approved</span>
                    )}
                  </td>
                )}
                {visibleColumns.sequence && (
                  <td className="px-4 py-3 align-top text-gray-400">{lot.sequence}</td>
                )}
                <td className="px-4 py-3 align-top text-right">
                  <div className="flex items-center justify-end gap-2 text-xs">
                    <Link
                      href={`/admin/auctions/${auctionId}/lots/${lot._id}/edit`}
                      className="text-orange-400 hover:text-orange-300 font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => onTransferIntent?.('move', [lot._id])}
                      className="text-blue-300 hover:text-blue-200"
                    >
                      Transfer
                    </button>
                    {lot.requiresApproval && (
                      <button
                        type="button"
                        onClick={() => onBulkAction('approve', [lot._id])}
                        className="text-green-400 hover:text-green-300"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLots.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm">
          No lots match your filters yet.
        </div>
      )}
    </div>
  );
}








