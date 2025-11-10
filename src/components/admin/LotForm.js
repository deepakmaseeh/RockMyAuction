'use client';

import { useState } from 'react';
import MediaManager from './MediaManager';
import AIAssistPanel from './AIAssistPanel';

export default function LotForm({ auctionId, lot = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    lotNumber: lot?.lotNumber || '',
    title: lot?.title || '',
    subtitle: lot?.subtitle || '',
    description: lot?.description || '',
    conditionReport: lot?.conditionReport || '',
    category: lot?.category || '',
    quantity: lot?.quantity || 1,
    estimateLow: lot?.estimateLow || 0,
    estimateHigh: lot?.estimateHigh || 0,
    startingBid: lot?.startingBid || 0,
    reservePrice: lot?.reservePrice || 0,
    status: lot?.status || 'draft',
    featured: lot?.featured || false,
    videoUrl: lot?.videoUrl || '',
    attributes: lot?.attributes || {},
    images: lot?.images || []
  });

  const [showAI, setShowAI] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAttributeChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      attributes: { ...prev.attributes, [key]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving lot');
    } finally {
      setSaving(false);
    }
  };

  const handleAIGenerate = (draft) => {
    setFormData(prev => ({
      ...prev,
      title: draft.title || prev.title,
      subtitle: draft.subtitle || prev.subtitle,
      description: draft.description || prev.description,
      conditionReport: draft.conditionReport || prev.conditionReport,
      category: draft.category || prev.category,
      estimateLow: draft.estimateLow || prev.estimateLow,
      estimateHigh: draft.estimateHigh || prev.estimateHigh,
      attributes: { ...prev.attributes, ...draft.attributes },
      metadata: {
        ...prev.metadata,
        tags: draft.tags || []
      }
    }));
    setShowAI(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          <button
            type="button"
            onClick={() => setShowAI(true)}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm"
          >
            🤖 AI Assist
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Lot Number *</label>
            <input
              type="text"
              value={formData.lotNumber}
              onChange={(e) => handleChange('lotNumber', e.target.value)}
              required
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            maxLength={80}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Subtitle</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            maxLength={200}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={6}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Condition Report</label>
          <textarea
            value={formData.conditionReport}
            onChange={(e) => handleChange('conditionReport', e.target.value)}
            rows={4}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded"
          />
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Estimate Low ($)</label>
            <input
              type="number"
              value={formData.estimateLow}
              onChange={(e) => handleChange('estimateLow', parseFloat(e.target.value) || 0)}
              min={0}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estimate High ($)</label>
            <input
              type="number"
              value={formData.estimateHigh}
              onChange={(e) => handleChange('estimateHigh', parseFloat(e.target.value) || 0)}
              min={formData.estimateLow}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Starting Bid ($)</label>
            <input
              type="number"
              value={formData.startingBid}
              onChange={(e) => handleChange('startingBid', parseFloat(e.target.value) || 0)}
              min={0}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reserve Price ($)</label>
            <input
              type="number"
              value={formData.reservePrice}
              onChange={(e) => handleChange('reservePrice', parseFloat(e.target.value) || 0)}
              min={formData.startingBid}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Media</h2>
        <MediaManager
          images={formData.images}
          onChange={(images) => handleChange('images', images)}
        />
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Video URL</label>
          <input
            type="url"
            value={formData.videoUrl}
            onChange={(e) => handleChange('videoUrl', e.target.value)}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded"
          />
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Attributes</h2>
        <div className="space-y-2">
          {Object.entries(formData.attributes || {}).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <input
                type="text"
                value={key}
                onChange={(e) => {
                  const newAttrs = { ...formData.attributes };
                  delete newAttrs[key];
                  newAttrs[e.target.value] = value;
                  handleChange('attributes', newAttrs);
                }}
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded"
                placeholder="Attribute name"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => handleAttributeChange(key, e.target.value)}
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded"
                placeholder="Value"
              />
              <button
                type="button"
                onClick={() => {
                  const newAttrs = { ...formData.attributes };
                  delete newAttrs[key];
                  handleChange('attributes', newAttrs);
                }}
                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAttributeChange('', '')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
          >
            + Add Attribute
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => handleChange('featured', e.target.checked)}
              className="w-4 h-4"
            />
            <label>Featured Lot</label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="sold">Sold</option>
              <option value="passed">Passed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-orange-600 hover:bg-orange-700 px-6 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Lot'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-medium"
        >
          Cancel
        </button>
      </div>

      {showAI && (
        <AIAssistPanel
          images={formData.images}
          onGenerate={handleAIGenerate}
          onClose={() => setShowAI(false)}
        />
      )}
    </form>
  );
}






