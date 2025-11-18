'use client';

import { useState } from 'react';
import auctionAPI from '@/lib/auctionAPI';

export default function AIAssistPanel({ images, onGenerate, onClose }) {
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(null);
  const [baseline, setBaseline] = useState({
    title: '',
    description: '',
    category: ''
  });

  const handleGenerate = async () => {
    if (!images || images.length === 0) {
      alert('Please add at least one image first');
      return;
    }

    setLoading(true);
    try {
      const prompt = `Generate lot draft for: ${baseline.title || 'item'}${baseline.category ? ` (Category: ${baseline.category})` : ''}${baseline.description ? ` - ${baseline.description}` : ''}`;
      
      const response = await auctionAPI.generateLotDraft(prompt, {
        imageUrls: images,
        ...baseline
      });
      
      // Handle different response formats
      const draftData = response.draft || response.data || response;
      if (draftData) {
        setDraft(draftData);
      } else {
        alert('Error: ' + (response.error || 'Failed to generate draft'));
      }
    } catch (error) {
      console.error('Error generating draft:', error);
      alert('Error generating draft: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (draft) {
      onGenerate(draft);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">AI Assist - Generate Lot Description</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Baseline Title (optional)</label>
            <input
              type="text"
              value={baseline.title}
              onChange={(e) => setBaseline({ ...baseline, title: e.target.value })}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Baseline Category (optional)</label>
            <input
              type="text"
              value={baseline.category}
              onChange={(e) => setBaseline({ ...baseline, category: e.target.value })}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !images || images.length === 0}
            className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Generating...' : '🤖 Generate Draft from Images'}
          </button>

          {draft && (
            <div className="mt-6 space-y-4 border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold">Generated Draft Preview</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <div className="bg-gray-700 p-3 rounded">{draft.title}</div>
              </div>

              {draft.subtitle && (
                <div>
                  <label className="block text-sm font-medium mb-1">Subtitle</label>
                  <div className="bg-gray-700 p-3 rounded">{draft.subtitle}</div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <div className="bg-gray-700 p-3 rounded whitespace-pre-wrap">{draft.description}</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Estimate</label>
                <div className="bg-gray-700 p-3 rounded">
                  ${draft.estimateLow?.toLocaleString()} - ${draft.estimateHigh?.toLocaleString()}
                </div>
                {draft.estimateRationale && (
                  <div className="text-xs text-gray-400 mt-1">{draft.estimateRationale}</div>
                )}
              </div>

              {Object.keys(draft.attributes || {}).length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-1">Attributes</label>
                  <div className="bg-gray-700 p-3 rounded">
                    {Object.entries(draft.attributes).map(([key, value]) => (
                      <div key={key} className="mb-1">
                        <strong>{key}:</strong> {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleApply}
                  className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-medium"
                >
                  Apply to Form
                </button>
                <button
                  onClick={() => setDraft(null)}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-medium"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}








