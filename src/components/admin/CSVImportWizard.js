'use client';

import { useMemo, useRef, useState } from 'react';

const FIELD_CONFIGS = [
  { key: 'lotNumber', label: 'Lot Number', required: true },
  { key: 'title', label: 'Title', required: true },
  { key: 'descriptionHtml', label: 'Description (HTML)', required: false },
  { key: 'additionalDescriptionHtml', label: 'Additional Description', required: false },
  { key: 'category', label: 'Category', required: false },
  { key: 'companyCategory', label: 'Company Category', required: false },
  { key: 'estimateLow', label: 'Estimate Low', required: false },
  { key: 'estimateHigh', label: 'Estimate High', required: false },
  { key: 'startingBid', label: 'Starting Bid', required: false },
  { key: 'reservePrice', label: 'Reserve Price', required: false },
  { key: 'requiresApproval', label: 'Requires Approval', required: false },
  { key: 'status', label: 'Status', required: false },
];

const REQUIRED_KEYS = FIELD_CONFIGS.filter((field) => field.required).map((field) => field.key);

function parseCsvLine(line = '') {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  return values.map((value) => value.replace(/^"|"$/g, ''));
}

function autoMap(headers = []) {
  const mapping = {};
  headers.forEach((header) => {
    const clean = header.toLowerCase();
    FIELD_CONFIGS.forEach((field) => {
      if (!mapping[field.key]) {
        if (clean === field.key.toLowerCase()) {
          mapping[field.key] = header;
        } else if (field.key === 'lotNumber' && clean.includes('lot')) {
          mapping[field.key] = header;
        } else if (field.key === 'title' && clean.includes('title')) {
          mapping[field.key] = header;
        } else if (field.key === 'descriptionHtml' && clean.includes('description')) {
          mapping[field.key] = header;
        }
      }
    });
  });
  return mapping;
}

export default function CSVImportWizard({ auctionId, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const unmappedColumns = useMemo(() => {
    const assigned = new Set(Object.values(mapping).filter(Boolean));
    return headers.filter((header) => !assigned.has(header));
  }, [headers, mapping]);

  const validateRequired = useMemo(() => {
    return REQUIRED_KEYS.every((key) => mapping[key]);
  }, [mapping]);

  const handleFileSelect = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setError('');
    setPreview(null);
    setMapping({});
    setStep(1);

    try {
      const text = await selectedFile.text();
      const lines = text.split(/\r?\n/).filter((line) => line.trim());
      if (!lines.length) {
        throw new Error('CSV file is empty.');
      }
      const parsedHeaders = parseCsvLine(lines[0]);
      if (!parsedHeaders.length) {
        throw new Error('Failed to read CSV headers.');
      }
      setHeaders(parsedHeaders);
      setMapping(autoMap(parsedHeaders));
      setFile(selectedFile);
      setStep(2);
    } catch (err) {
      console.error('CSV parsing error', err);
      setError(err.message || 'Failed to read CSV file.');
      setFile(null);
      setHeaders([]);
      setMapping({});
    } finally {
      event.target.value = '';
    }
  };

  const assignColumn = (fieldKey, columnName) => {
    if (!columnName) {
      clearColumn(fieldKey);
      return;
    }
    setMapping((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (next[key] === columnName) {
          next[key] = undefined;
        }
      });
      next[fieldKey] = columnName;
      return next;
    });
  };

  const clearColumn = (fieldKey) => {
    setMapping((prev) => {
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  };

  const handleValidate = async () => {
    if (!file) return;
    if (!validateRequired) {
      setError('Please map all required fields before continuing.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const columnMap = {};
      Object.entries(mapping).forEach(([fieldKey, columnName]) => {
        if (columnName) {
          columnMap[columnName] = fieldKey;
        }
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('auctionId', auctionId);
      formData.append('dryRun', 'true');
      formData.append('columnMap', JSON.stringify(columnMap));

      const response = await fetch('/api/admin/lots/import', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Validation failed.');
      }

      setPreview(data);
      setStep(3);
    } catch (err) {
      console.error('Validation error', err);
      setError(err.message || 'Failed to validate CSV.');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file || !preview) return;
    setLoading(true);
    setError('');

    try {
      const columnMap = {};
      Object.entries(mapping).forEach(([fieldKey, columnName]) => {
        if (columnName) {
          columnMap[columnName] = fieldKey;
        }
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('auctionId', auctionId);
      formData.append('dryRun', 'false');
      formData.append('columnMap', JSON.stringify(columnMap));

      const response = await fetch('/api/admin/lots/import', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Import failed.');
      }

      onSuccess();
    } catch (err) {
      console.error('Import error', err);
      setError(err.message || 'Failed to import lots.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (event, fieldKey) => {
    event.preventDefault();
    const columnName = event.dataTransfer.getData('text/plain');
    if (columnName) {
      assignColumn(fieldKey, columnName);
    }
  };

  const handleDragStart = (event, columnName) => {
    event.dataTransfer.setData('text/plain', columnName);
  };

  const renderStepOne = () => (
    <div className="space-y-4">
      <p className="text-gray-300 text-sm">
        Upload a CSV file of lots. You can download a template from the export tools.
      </p>
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center bg-gray-900/60">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
        >
          Select CSV File
        </button>
        <p className="text-xs text-gray-500 mt-2">CSV up to 10 MB</p>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Map CSV Columns</h3>
        <p className="text-sm text-gray-400">
          Drag columns from the list on the right into each field, or choose from the dropdown.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 space-y-3">
          {FIELD_CONFIGS.map((field) => (
            <div key={field.key} className="bg-gray-900/70 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-medium text-white">{field.label}</div>
                  {field.required ? (
                    <div className="text-xs text-orange-400">Required</div>
                  ) : (
                    <div className="text-xs text-gray-500">Optional</div>
                  )}
                </div>
                <select
                  value={mapping[field.key] || ''}
                  onChange={(e) => assignColumn(field.key, e.target.value || undefined)}
                  className="bg-gray-800 border border-gray-700 text-sm rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">Select column…</option>
                  {headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
              <div
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, field.key)}
                className={`h-12 flex items-center justify-between px-3 rounded border ${
                  mapping[field.key]
                    ? 'border-green-500/60 bg-green-500/10'
                    : 'border-gray-700 bg-gray-900/40'
                }`}
              >
                {mapping[field.key] ? (
                  <>
                    <span className="text-sm text-green-300">{mapping[field.key]}</span>
                    <button
                      type="button"
                      onClick={() => clearColumn(field.key)}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-gray-500">Drop a column here</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="md:col-span-5">
          <div className="bg-gray-900/70 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white">Available Columns</h4>
              <span className="text-xs text-gray-500">{headers.length} total</span>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {headers.map((header) => {
                const assigned = Object.values(mapping).includes(header);
                return (
                  <div
                    key={header}
                    draggable
                    onDragStart={(event) => handleDragStart(event, header)}
                    className={`px-3 py-2 rounded border text-sm cursor-grab ${
                      assigned
                        ? 'border-green-500/50 bg-green-500/10 text-green-200'
                        : 'border-gray-700 bg-gray-800/60 text-gray-200'
                    }`}
                  >
                    {header}
                    {assigned && <span className="text-xs text-gray-400 ml-2">(mapped)</span>}
                  </div>
                );
              })}
              {unmappedColumns.length === 0 && (
                <div className="text-xs text-gray-500 text-center py-4">
                  All columns have been mapped.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          {validateRequired ? (
            <span className="text-green-400">All required fields mapped.</span>
          ) : (
            <span className="text-orange-400">Map all required fields before continuing.</span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleValidate}
            disabled={!validateRequired || loading}
            className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
          >
            {loading ? 'Validating…' : 'Validate CSV'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStepThree = () => (
    <div className="space-y-4">
      {preview && (
        <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4 space-y-3">
          <div className="text-sm text-gray-200">
            Valid rows: <span className="text-green-400 font-semibold">{preview.valid}</span>
          </div>
          <div className="text-sm text-gray-200">
            Invalid rows:{' '}
            <span className={preview.invalid > 0 ? 'text-red-400 font-semibold' : 'text-gray-400'}>
              {preview.invalid}
            </span>
          </div>
          {preview.errors && preview.errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3 max-h-40 overflow-y-auto">
              <h4 className="text-sm font-semibold text-red-300 mb-2">Validation Errors</h4>
              <ul className="space-y-1 text-xs text-red-200">
                {preview.errors.slice(0, 12).map((err, index) => (
                  <li key={`${err.row}-${index}`}>
                    Row {err.row}: {err.message}
                  </li>
                ))}
              </ul>
              {preview.errors.length > 12 && (
                <div className="text-xs text-red-200 mt-1">
                  … {preview.errors.length - 12} more error(s)
                </div>
              )}
            </div>
          )}
          {preview.preview && preview.preview.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Preview</h4>
              <div className="space-y-1 text-xs text-gray-300">
                {preview.preview.slice(0, 5).map((row, index) => (
                  <div key={index}>
                    Lot {row.lotNumber}: {row.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm"
        >
          Back
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleImport}
            disabled={loading || (preview && preview.invalid > 0)}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
          >
            {loading ? 'Importing…' : 'Import Lots'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl border border-gray-800 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Import Lots from CSV</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-200 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}
          {step === 1 && renderStepOne()}
          {step === 2 && renderStepTwo()}
          {step === 3 && renderStepThree()}
        </div>
      </div>
    </div>
  );
}








