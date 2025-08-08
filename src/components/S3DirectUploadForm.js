'use client'

import { useState } from 'react';

export default function S3DirectUploadForm() {
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

    // Get environment variables from .env.local
    const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'my-s3-bucket-auctiondata';
    const region = process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1';
    const fileName = `${Date.now()}-${file.name}`;
    const s3URL = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;

    try {
      setUploading(true);
      setError('');
      
      const res = await fetch(s3URL, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (res.ok) {
        setUploadURL(s3URL);
        alert('✅ File uploaded successfully!');
      } else {
        setError(`Upload failed. Status: ${res.status}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload error. See console for details.');
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