'use client';

import { useState } from 'react';

const CSV_HEADER_HINT = 'originalLotNumber,newLotNumber';

function parseCSV(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0].split(',').map((header) => header.trim().toLowerCase());
  const originalIndex = headers.indexOf('originallotnumber');
  const newIndex = headers.indexOf('newlotnumber');

  if (originalIndex === -1 || newIndex === -1) {
    throw new Error('CSV must include columns originalLotNumber,newLotNumber');
  }

  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const values = lines[i].split(',').map((value) => value.trim());
    rows.push({
      originalLotNumber: values[originalIndex],
      newLotNumber: values[newIndex],
    });
  }

  return rows.filter(
    (row) => row.originalLotNumber && row.newLotNumber && row.originalLotNumber !== row.newLotNumber
  );
}

export default function LotRenumberModal({ open, onClose, onSubmit }) {
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFileName(file.name);
    setError('');
    setRows([]);

    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      if (!parsed.length) {
        setError('No valid rows found in CSV.');
        return;
      }
      setRows(parsed);
    } catch (err) {
      console.error('Failed to parse CSV', err);
      setError(err.message || 'Failed to parse CSV file.');
    } finally {
      event.target.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!rows.length) {
      setError('Upload a CSV with renumber mappings first.');
      return;
    }
    const duplicateNew = rows
      .map((row) => row.newLotNumber)
      .filter((value, index, self) => self.indexOf(value) !== index);
    if (duplicateNew.length > 0) {
      setError(`Duplicate new lot numbers detected: ${Array.from(new Set(duplicateNew)).join(', ')}`);
      return;
    }
    setLoading(true);
    setError('');

    try {
      await onSubmit(rows);
      setRows([]);
      setFileName('');
    } catch (err) {
      console.error('Renumber error', err);
      setError(err.message || 'Failed to renumber lots.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-white">Bulk Renumber Lots</h3>
            <p className="text-sm text-gray-400">
              Upload a CSV with original and new lot numbers.
            </p>
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([`${CSV_HEADER_HINT}\n`], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'lot-renumber-template.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="mt-2 text-xs text-orange-400 hover:text-orange-300"
            >
              Download blank template
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setRows([]);
              setFileName('');
              setError('');
              onClose();
            }}
            className="text-gray-400 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="bg-gray-800 border border-dashed border-gray-600 rounded-lg p-4 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="renumber-upload"
            />
            <label
              htmlFor="renumber-upload"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer text-sm text-gray-200 hover:border-orange-500"
            >
              Upload CSV
            </label>
            {fileName && <div className="text-xs text-gray-400 mt-2">{fileName}</div>}
            <div className="text-xs text-gray-500 mt-2">
              CSV headers must include: <code className="text-orange-400">{CSV_HEADER_HINT}</code>
            </div>
          </div>

          {rows.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Preview ({rows.length} changes)</span>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([CSV_HEADER_HINT + '\n'], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'lot-renumber-template.csv';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="text-xs text-orange-400 hover:text-orange-300"
                >
                  Download template
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto border border-gray-800 rounded-lg">
                <table className="w-full text-xs">
                  <thead className="bg-gray-800">
                    <tr className="text-left text-gray-400 uppercase tracking-wide">
                      <th className="px-3 py-2">Original</th>
                      <th className="px-3 py-2">New</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 12).map((row, index) => (
                      <tr key={`${row.originalLotNumber}-${row.newLotNumber}-${index}`} className="border-t border-gray-800">
                        <td className="px-3 py-2 text-gray-200">{row.originalLotNumber}</td>
                        <td className="px-3 py-2 text-gray-200">{row.newLotNumber}</td>
                      </tr>
                    ))}
                    {rows.length > 12 && (
                      <tr className="border-t border-gray-800">
                        <td className="px-3 py-2 text-gray-400" colSpan={2}>
                          … {rows.length - 12} more row(s)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/70 rounded-b-xl flex justify-end gap-3">
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
            disabled={loading || rows.length === 0}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-orange-600 hover:bg-orange-700 disabled:opacity-40"
          >
            {loading ? 'Processing…' : `Renumber ${rows.length} lot(s)`}
          </button>
        </div>
      </div>
    </div>
  );
}

