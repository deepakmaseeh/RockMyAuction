'use client';

import { useMemo, useState } from 'react';

export default function LotTransferModal({
  open,
  mode = 'move',
  lots = [],
  availableCatalogs = [],
  onClose,
  onConfirm,
  submitting = false,
}) {
  const [selectedCatalogId, setSelectedCatalogId] = useState('');
  const [includeMedia, setIncludeMedia] = useState(true);
  const [copyImages, setCopyImages] = useState(true);

  const lotsSummary = useMemo(
    () =>
      lots.map((lot) => `${lot.lotNumber || '—'} · ${lot.title || 'Untitled'}`),
    [lots]
  );

  const actionLabel = mode === 'copy' ? 'Copy' : 'Move';

  const canSubmit = selectedCatalogId && lots.length > 0;

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {actionLabel} {lots.length} lot{lots.length === 1 ? '' : 's'}
            </h2>
            <p className="text-sm text-gray-400">
              Choose a destination catalog to complete this {mode}.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedCatalogId('');
              onClose?.();
            }}
            className="text-2xl leading-none text-gray-500 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Destination catalog
            </label>
            <select
              value={selectedCatalogId}
              onChange={(event) => setSelectedCatalogId(event.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="">Select a catalog…</option>
              {availableCatalogs.map((catalog) => (
                <option key={catalog.id} value={catalog.id}>
                  {catalog.name}
                  {catalog.date ? ` • ${catalog.date}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-900/70 p-3">
            <label className="flex items-center gap-2 text-sm text-gray-200">
              <input
                type="checkbox"
                checked={includeMedia}
                onChange={(event) => setIncludeMedia(event.target.checked)}
                className="h-4 w-4"
              />
              Include lot media (photos, documents, video links)
            </label>
            {mode === 'copy' && (
              <label className="flex items-center gap-2 text-sm text-gray-200">
                <input
                  type="checkbox"
                  checked={copyImages}
                  onChange={(event) => setCopyImages(event.target.checked)}
                  className="h-4 w-4"
                />
                Keep copies of media in current catalog
              </label>
            )}
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Selected lots
            </p>
            <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto text-sm text-gray-200">
              {lotsSummary.map((summary) => (
                <li key={summary} className="truncate">
                  {summary}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-800 bg-gray-900/70 px-6 py-4">
          <button
            type="button"
            onClick={() => {
              setSelectedCatalogId('');
              onClose?.();
            }}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-gray-500"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={() => {
              onConfirm?.({
                mode,
                lotIds: lots.map((lot) => lot._id),
                targetCatalogId: selectedCatalogId,
                includeMedia,
                copyImages,
              });
              setSelectedCatalogId('');
            }}
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-40"
          >
            {submitting ? `${actionLabel}ing…` : `${actionLabel} lots`}
          </button>
        </div>
      </div>
    </div>
  );
}

