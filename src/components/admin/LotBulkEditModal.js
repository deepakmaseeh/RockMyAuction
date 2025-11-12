'use client';

import { useMemo, useState } from 'react';

const FIELD_DEFINITIONS = [
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'companyCategory', label: 'Company Category', type: 'text' },
  { key: 'startingBid', label: 'Starting Bid', type: 'number' },
  { key: 'reservePrice', label: 'Reserve Price', type: 'number' },
  { key: 'estimateLow', label: 'Estimate Low', type: 'number' },
  { key: 'estimateHigh', label: 'Estimate High', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['draft', 'pending', 'published', 'sold', 'passed', 'cancelled'] },
  { key: 'featured', label: 'Featured', type: 'boolean' },
  { key: 'requiresApproval', label: 'Requires Approval', type: 'boolean' },
];

export default function LotBulkEditModal({ open, onClose, onSubmit, selectedCount }) {
  const [field, setField] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fieldDefinition = useMemo(
    () => FIELD_DEFINITIONS.find((definition) => definition.key === field) || null,
    [field]
  );

  const handleSubmit = async () => {
    if (!fieldDefinition) {
      setError('Please choose a field to edit.');
      return;
    }

    setLoading(true);
    setError('');

    const payloadValue = (() => {
      if (fieldDefinition.type === 'number') {
        return Number(value);
      }
      if (fieldDefinition.type === 'boolean') {
        return value === 'true';
      }
      return value;
    })();

    try {
      await onSubmit({
        field: fieldDefinition.key,
        value: payloadValue,
      });
      setField('');
      setValue('');
    } catch (err) {
      console.error('Bulk edit error', err);
      setError(err.message || 'Failed to update lots.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-white">Bulk edit lots</h3>
            <p className="text-sm text-gray-400">
              {selectedCount} lot{selectedCount === 1 ? '' : 's'} selected
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Field to update</label>
            <select
              value={field}
              onChange={(e) => {
                setField(e.target.value);
                setValue('');
                setError('');
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">Select field…</option>
              {FIELD_DEFINITIONS.map((definition) => (
                <option key={definition.key} value={definition.key}>
                  {definition.label}
                </option>
              ))}
            </select>
          </div>

          {fieldDefinition && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">New value</label>
              {fieldDefinition.type === 'select' && (
                <select
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">Select…</option>
                  {fieldDefinition.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              {fieldDefinition.type === 'boolean' && (
                <select
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">Select…</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              )}
              {fieldDefinition.type === 'number' && (
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              )}
              {fieldDefinition.type === 'text' && (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              )}
            </div>
          )}

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
      {selectedCount === 0 && (
        <div className="text-sm text-orange-400 bg-orange-500/10 border border-orange-500/40 rounded-lg px-3 py-2">
          Select at least one lot to apply bulk edits.
        </div>
      )}
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3 bg-gray-900/70 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-700 text-sm text-gray-300 hover:border-gray-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !fieldDefinition || value === '' || selectedCount === 0}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-orange-600 hover:bg-orange-700 disabled:opacity-40"
          >
            {loading ? 'Updating…' : 'Apply changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

