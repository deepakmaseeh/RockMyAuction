'use client';

import { useState, useRef } from 'react';

export default function CSVImportWizard({ auctionId, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      validateFile(selectedFile);
    }
  };

  const validateFile = async (fileToValidate) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', fileToValidate);
      formData.append('auctionId', auctionId);
      formData.append('dryRun', 'true');

      const res = await fetch('/api/admin/lots/import', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setPreview(data);
        setStep(2);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error validating file:', error);
      alert('Error validating file');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('auctionId', auctionId);
      formData.append('dryRun', 'false');

      const res = await fetch('/api/admin/lots/import', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        alert(`Import completed! ${data.imported} lots imported, ${data.failed} failed.`);
        onSuccess();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error importing:', error);
      alert('Error importing file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Import Lots from CSV</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-gray-400">
              Upload a CSV file with lot data. Required columns: lotNumber, title
            </p>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
              >
                Select CSV File
              </button>
              {file && <span className="ml-4">{file.name}</span>}
            </div>
            {loading && <div className="text-center">Validating file...</div>}
          </div>
        )}

        {step === 2 && preview && (
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold mb-2">Validation Results</h3>
              <div className="space-y-1 text-sm">
                <div>✓ Valid rows: {preview.valid}</div>
                <div className={preview.invalid > 0 ? 'text-red-400' : ''}>
                  ✗ Invalid rows: {preview.invalid}
                </div>
              </div>

              {preview.errors && preview.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Errors:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1 text-xs">
                    {preview.errors.slice(0, 10).map((error, idx) => (
                      <div key={idx} className="text-red-400">
                        Row {error.row}: {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {preview.preview && preview.preview.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Preview (first 3 rows):</h4>
                  <div className="space-y-1 text-xs">
                    {preview.preview.slice(0, 3).map((row, idx) => (
                      <div key={idx} className="text-gray-300">
                        Lot {row.lotNumber}: {row.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleImport}
                disabled={loading || preview.invalid > 0}
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {loading ? 'Importing...' : 'Import Lots'}
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setPreview(null);
                  setFile(null);
                }}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-medium"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}





