'use client'

import { useState } from 'react';
import auctionAPI from '@/lib/auctionAPI';

export default function GCSDirectUploadForm() {
  const [file, setFile] = useState(null);
  const [uploadURL, setUploadURL] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      // Get presigned URL from backend using API service
      const presignedData = await auctionAPI.getUploadUrl(file.name, file.type);
      
      if (!presignedData || !presignedData.url || !presignedData.fileUrl) {
        throw new Error(presignedData?.error || 'Failed to get upload URL');
      }

      const { url, fileUrl } = presignedData;

      // Upload file to Google Cloud Storage using presigned URL
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (uploadResponse.ok) {
        setUploadURL(fileUrl);
        alert('✅ File uploaded successfully to Google Cloud Storage!');
      } else {
        setError(`Upload failed. Status: ${uploadResponse.status}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload error. See console for details.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-[#18181B] rounded-xl shadow-md">

      {error && (
        <div className="p-3 bg-red-900/40 text-red-400 text-sm rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Select File
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-orange-500 file:text-white
            hover:file:bg-orange-600"
        />
      </div>
      
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`w-full py-2 rounded-lg font-semibold ${!file || uploading
          ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
          : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadURL && (
        <div className="mt-6 p-4 bg-[#232326] rounded-lg">
          <p className="text-gray-300 mb-2">Uploaded File:</p>
          <a 
            href={uploadURL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-orange-400 hover:text-orange-300 underline text-sm break-all"
          >
            {uploadURL}
          </a>
          <div className="mt-3 border border-[#333] rounded-lg overflow-hidden">
            <img 
              src={uploadURL} 
              alt="Uploaded preview" 
              className="w-full h-auto" 
            />
          </div>
        </div>
      )}
    </div>
  );
}