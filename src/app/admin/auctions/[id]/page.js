'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LotTable from '@/components/admin/LotTable';
import CSVImportWizard from '@/components/admin/CSVImportWizard';
import LotBulkEditModal from '@/components/admin/LotBulkEditModal';
import LotRenumberModal from '@/components/admin/LotRenumberModal';
import LotTransferModal from '@/components/admin/LotTransferModal';
import CatalogPreviewPanel from '@/components/admin/CatalogPreviewPanel';
import useCatalogAdminActions from '@/hooks/useCatalogAdminActions';

const API_HEADERS = { 'Content-Type': 'application/json' };

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export default function AdminAuctionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const auctionId = params.id;

  const [auction, setAuction] = useState(null);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [selectedLotIds, setSelectedLotIds] = useState([]);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [renumberOpen, setRenumberOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [transferState, setTransferState] = useState({
    open: false,
    mode: 'move',
    lotIds: [],
    submitting: false,
  });
  const [availableCatalogs, setAvailableCatalogs] = useState([]);
  const [approvalDrawerOpen, setApprovalDrawerOpen] = useState(false);
  const [approvalQueue, setApprovalQueue] = useState([]);
  const [queueLoading, setQueueLoading] = useState(false);

  const catalogActions = useCatalogAdminActions();

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const loadAuctionDetails = useCallback(async () => {
    if (!auctionId) return;
    setLoading(true);
    try {
      const [auctionResponse, lotsResponse] = await Promise.all([
        fetchJSON(`/api/admin/auctions/${auctionId}`),
        fetchJSON(`/api/admin/auctions/${auctionId}/lots?sort=sequence&order=asc`),
      ]);
      setAuction(auctionResponse.data);
      setLots(lotsResponse.data);
    } catch (err) {
      console.error('Failed to load auction details', err);
      setError(err.message || 'Failed to load auction');
    } finally {
      setLoading(false);
    }
  }, [auctionId]);

  useEffect(() => {
    loadAuctionDetails();
  }, [loadAuctionDetails]);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const iosRegex = /iPad|iPhone|iPod/;
    setIsIOS(iosRegex.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (!auctionId) return;
    let active = true;
    catalogActions
      .fetchAvailableCatalogs(auctionId)
      .then((catalogs) => {
        if (active) setAvailableCatalogs(catalogs);
      })
      .catch((err) => console.error('Failed to load catalog list', err));
    return () => {
      active = false;
    };
  }, [auctionId, catalogActions]);

  const refreshLots = async () => {
    try {
      const lotsResponse = await fetchJSON(`/api/admin/auctions/${auctionId}/lots?sort=sequence&order=asc`);
      setLots(lotsResponse.data);
    } catch (err) {
      console.error('Failed to refresh lots', err);
    }
  };

  const handleOpenPreview = () => setPreviewOpen(true);

  const handleExportCatalog = async (format = 'csv') => {
    setActionLoading(true);
    try {
      const result = await catalogActions.exportCatalog({ auctionId, format });
      setFeedback(result.message);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to queue export (connect backend to enable).');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportImages = async () => {
    setActionLoading(true);
    try {
      const result = await catalogActions.exportImages({ auctionId });
      setFeedback(result.message);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to request image export (stub).');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendToPlatform = async (platform) => {
    setActionLoading(true);
    try {
      const result = await catalogActions.sendToPlatform({ auctionId, platform });
      setFeedback(result.message);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(`Failed to queue sync to ${platform}. Integrate backend to enable.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenTransfer = (mode, lotIds) => {
    const ids = lotIds && lotIds.length ? lotIds : selectedLotIds;
    if (!ids.length) {
      setError('Select at least one lot to transfer.');
      return;
    }
    setTransferState({ open: true, mode, lotIds: ids, submitting: false });
  };

  const closeTransferModal = () =>
    setTransferState({ open: false, mode: 'move', lotIds: [], submitting: false });

  const handleConfirmTransfer = async (payload) => {
    setTransferState((prev) => ({ ...prev, submitting: true }));
    try {
      const result = await catalogActions.transferLots(payload);
      setFeedback(result.message);
      setSelectedLotIds([]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to queue transfer (stub).');
    } finally {
      closeTransferModal();
    }
  };

  const handleApprovalQueueOpen = async () => {
    setApprovalDrawerOpen(true);
    setQueueLoading(true);
    try {
      const queue = await catalogActions.fetchApprovalQueue();
      setApprovalQueue(queue);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load approval queue (stubbed data).');
    } finally {
      setQueueLoading(false);
    }
  };

  const handleResolveApproval = async (lotId, decision) => {
    try {
      await catalogActions.resolveApproval({ lotId, decision });
      setApprovalQueue((items) => items.filter((item) => item.id !== lotId));
      setFeedback(`Marked lot as ${decision}. Connect backend to persist.`);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to update approval status (stub).');
    }
  };

  const handleReorder = async (orderedIds) => {
    setActionLoading(true);
    try {
      await fetchJSON('/api/admin/lots/reorder', {
        method: 'PUT',
        headers: API_HEADERS,
        body: JSON.stringify({ auctionId, order: orderedIds }),
      });
      setFeedback('Lot order updated.');
      setError(null);
      await refreshLots();
    } catch (err) {
      console.error('Reorder failed', err);
      setError(err.message || 'Failed to reorder lots.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkAction = async (action, explicitLotIds = null) => {
    const lotIds = explicitLotIds && explicitLotIds.length > 0 ? explicitLotIds : selectedLotIds;
    if (!lotIds.length) {
      setError('Select at least one lot to perform this action.');
      return;
    }

    if (action === 'delete') {
      const confirmed = window.confirm(
        `Delete ${lotIds.length} lot${lotIds.length === 1 ? '' : 's'}? This cannot be undone.`
      );
      if (!confirmed) return;
    }

    setActionLoading(true);
    try {
      await fetchJSON('/api/admin/lots/bulk', {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ action, lotIds }),
      });
      setFeedback(`Bulk action "${action}" completed.`);
      setError(null);
      setSelectedLotIds([]);
      await refreshLots();
    } catch (err) {
      console.error('Bulk action failed', err);
      setError(err.message || 'Failed to process bulk action.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkEditSubmit = async ({ field, value }) => {
    if (!selectedLotIds.length) {
      throw new Error('Select at least one lot before applying changes.');
    }
    await fetchJSON('/api/admin/lots/bulk', {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify({
        action: 'update_field',
        lotIds: selectedLotIds,
        field,
        value,
      }),
    });
    setFeedback(`Updated ${selectedLotIds.length} lot(s).`);
    setError(null);
    setBulkEditOpen(false);
    setSelectedLotIds([]);
    await refreshLots();
  };

  const handleRenumberSubmit = async (mappings) => {
    await fetchJSON('/api/admin/lots/renumber', {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify({
        auctionId,
        mappings,
      }),
    });
    setFeedback(`Renumbered ${mappings.length} lot(s).`);
    setError(null);
    setRenumberOpen(false);
    await refreshLots();
  };

  const transferLots = useMemo(
    () => lots.filter((lot) => transferState.lotIds.includes(lot._id)),
    [lots, transferState.lotIds]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-5xl">Loading auction details…</div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-900 px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-5xl">Auction not found.</div>
      </div>
    );
  }

  const actionDescriptors = [
    { key: 'newLot', label: 'Create new lot' },
    { key: 'importCsv', label: 'Import CSV' },
    { key: 'preview', label: 'Preview catalog' },
    { key: 'exportCsv', label: 'Export CSV' },
    { key: 'exportImages', label: 'Export images' },
    { key: 'platform', label: 'Send to platform' },
    { key: 'approvals', label: 'Approval queue' },
  ];

  const actionStyles = {
    newLot:
      'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 focus:ring-orange-400',
    importCsv:
      'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-600/30 hover:from-sky-600 hover:to-blue-700 focus:ring-sky-400',
    preview:
      'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-600/30 hover:from-purple-600 hover:to-indigo-700 focus:ring-purple-400',
    exportCsv:
      'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-600 hover:to-green-700 focus:ring-emerald-400',
    exportImages:
      'bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg shadow-cyan-600/30 hover:from-teal-600 hover:to-cyan-700 focus:ring-cyan-400',
    platform:
      'bg-gradient-to-br from-fuchsia-500 to-rose-600 text-white shadow-lg shadow-fuchsia-600/30 hover:from-fuchsia-600 hover:to-rose-700 focus:ring-fuchsia-400',
    approvals:
      'bg-gradient-to-br from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/30 hover:from-amber-600 hover:to-yellow-600 focus:ring-amber-300',
  };

  const desktopButtonBase =
    'rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950';
  const mobileButtonBase =
    'rounded-lg px-3 py-3 text-[13px] font-medium transition active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950';

  const statusStyles = {
    live: 'border border-emerald-400/40 bg-emerald-500/15 text-emerald-200',
    scheduled: 'border border-blue-400/40 bg-blue-500/15 text-blue-200',
    closed: 'border border-gray-400/30 bg-gray-500/15 text-gray-200',
    draft: 'border border-gray-400/20 bg-gray-500/10 text-gray-200',
  };

  const handleAction = (key) => {
    switch (key) {
      case 'newLot':
        router.push(`/admin/auctions/${auctionId}/lots/new`);
        break;
      case 'importCsv':
        setShowImport(true);
        break;
      case 'preview':
        handleOpenPreview();
        break;
      case 'exportCsv':
        handleExportCatalog('csv');
        break;
      case 'exportImages':
        handleExportImages();
        break;
      case 'platform':
        handleSendToPlatform('Wavebid Integration');
        break;
      case 'approvals':
        handleApprovalQueueOpen();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-full bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <button
                onClick={() => router.back()}
                className={`${isIOS ? 'inline-flex' : 'hidden sm:inline-flex'} mb-3 items-center gap-2 text-xs font-medium text-gray-400 transition hover:text-white`}
              >
                <span className="text-lg">←</span> Back to auctions
              </button>
              <h1 className="text-2xl font-semibold sm:text-3xl">{auction.title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-400 sm:text-base">
                {auction.description || 'No description provided.'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${statusStyles[auction.status] || statusStyles.draft}`}
                >
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {auction.status?.toUpperCase() || 'DRAFT'}
                </span>
                {auction.startAt && (
                  <span>
                    Starts{' '}
                    {new Date(auction.startAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                )}
                {auction.endAt && (
                  <span>
                    Ends{' '}
                    {new Date(auction.endAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="sm:hidden">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Quick actions
            </p>
            <div className="grid grid-cols-2 gap-2">
              {actionDescriptors.map((action) => (
                <button
                  key={action.key}
                  onClick={() => handleAction(action.key)}
                  className={`${mobileButtonBase} ${actionStyles[action.key]}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden flex-wrap gap-2 sm:flex">
            {actionDescriptors.map((action) => (
              <button
                key={action.key}
                onClick={() => handleAction(action.key)}
                className={`${desktopButtonBase} ${actionStyles[action.key]}`}
              >
                {action.label}
              </button>
            ))}
          </div>

          {(feedback || error || actionLoading) && (
            <div className="space-y-2">
              {feedback && (
                <div className="rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                  {feedback}
                </div>
              )}
              {error && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}
              {actionLoading && <div className="text-sm text-gray-400">Processing…</div>}
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-black/40">
            <LotTable
              lots={lots}
              auctionId={auctionId}
              selectedLotIds={selectedLotIds}
              onSelectionChange={setSelectedLotIds}
              onReorder={handleReorder}
              onBulkAction={handleBulkAction}
              onOpenBulkEdit={() => setBulkEditOpen(true)}
              onOpenRenumber={() => setRenumberOpen(true)}
              onTransferIntent={handleOpenTransfer}
              onOpenApprovalQueue={handleApprovalQueueOpen}
            />
          </div>
        </div>
      </div>
      <Footer />

      {showImport && (
        <CSVImportWizard
          auctionId={auctionId}
          onClose={() => setShowImport(false)}
          onSuccess={() => {
            setShowImport(false);
            refreshLots();
            setFeedback('Import completed successfully.');
          }}
        />
      )}

      <LotBulkEditModal
        open={bulkEditOpen}
        onClose={() => setBulkEditOpen(false)}
        onSubmit={handleBulkEditSubmit}
        selectedCount={selectedLotIds.length}
      />

      <LotRenumberModal
        open={renumberOpen}
        onClose={() => setRenumberOpen(false)}
        onSubmit={handleRenumberSubmit}
      />

      <LotTransferModal
        open={transferState.open}
        mode={transferState.mode}
        lots={transferLots}
        availableCatalogs={availableCatalogs}
        onClose={closeTransferModal}
        onConfirm={handleConfirmTransfer}
        submitting={transferState.submitting}
      />

      <CatalogPreviewPanel
        open={previewOpen}
        auction={auction}
        lots={lots}
        onClose={() => setPreviewOpen(false)}
      />

      {approvalDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-md flex-col border-l border-gray-800 bg-[#08080d] shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">Approval queue</h3>
                <p className="text-xs text-gray-400">
                  Connect backend endpoints to replace this preview data with live submissions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setApprovalDrawerOpen(false)}
                className="text-2xl leading-none text-gray-500 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {queueLoading ? (
                <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 text-sm text-gray-400">
                  Loading pending approvals…
                </div>
              ) : approvalQueue.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/40 p-4 text-center text-sm text-gray-500">
                  Queue is clear. When bidders submit edits, they will appear here.
                </div>
              ) : (
                <div className="space-y-4">
                  {approvalQueue.map((item) => (
                    <div
                      key={item.id}
                      className="space-y-3 rounded-xl border border-gray-800 bg-gray-900/70 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Lot {item.lotNumber}
                          </p>
                          <h4 className="text-base font-semibold text-white">{item.title}</h4>
                        </div>
                        <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-xs text-yellow-300">
                          Pending
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Submitted by <strong className="text-gray-300">{item.submittedBy}</strong> ·{' '}
                        {new Date(item.submittedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleResolveApproval(item.id, 'rejected')}
                          className="rounded-lg border border-red-600 px-3 py-1 text-xs text-red-300 hover:bg-red-600/10"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResolveApproval(item.id, 'approved')}
                          className="rounded-lg bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}








