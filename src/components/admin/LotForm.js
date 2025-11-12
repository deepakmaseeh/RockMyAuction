'use client';

import { useEffect, useMemo, useState } from 'react';
import MediaManager from './MediaManager';
import AIAssistPanel from './AIAssistPanel';
import RichTextEditor from './RichTextEditor';
import PhotoGalleryModal from './PhotoGalleryModal';
import useCatalogAdminActions from '@/hooks/useCatalogAdminActions';

const STRIP_HTML_REGEX = /(<([^>]+)>)/gi;

const randomId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `lot-${Math.random().toString(36).slice(2, 10)}`;

function stripHtml(value = '') {
  return value?.replace?.(STRIP_HTML_REGEX, ' ')?.replace(/\s+/g, ' ')?.trim?.() ?? '';
}

function buildAttributeRows(attributes = {}) {
  return Object.entries(attributes || {}).map(([key, value]) => ({
    id: randomId(),
    key,
    value,
  }));
}

function buildAttributeMap(rows) {
  return rows.reduce((acc, row) => {
    const cleanKey = row.key.trim();
    if (!cleanKey) {
      return acc;
    }
    acc[cleanKey] = row.value ?? '';
    return acc;
  }, {});
}

function normalizeImages(images = []) {
  return images.map((image, index) => {
    if (typeof image === 'string') {
      return {
        id: randomId(),
        url: image,
        caption: '',
        order: index + 1,
      };
    }
    return {
      id: randomId(),
      url: image.url || '',
      caption: image.caption || '',
      order: image.order || index + 1,
    };
  });
}

export default function LotForm({
  lot = null,
  onSubmit,
  onCancel,
  navigation = {
    hasPrevious: false,
    hasNext: false,
    onSavePrevious: null,
    onSaveNext: null,
  },
}) {
  const [formData, setFormData] = useState(() => ({
    lotNumber: lot?.lotNumber || '',
    title: lot?.title || '',
    subtitle: lot?.subtitle || '',
    companyCategory: lot?.companyCategory || '',
    category: lot?.category || '',
    descriptionHtml: lot?.descriptionHtml || lot?.description || '',
    additionalDescriptionHtml:
      lot?.additionalDescriptionHtml || lot?.additionalDescription || '',
    quantity: lot?.quantity || 1,
    estimateLow: lot?.estimateLow || 0,
    estimateHigh: lot?.estimateHigh || 0,
    startingBid: lot?.startingBid || 0,
    reservePrice: lot?.reservePrice || 0,
    status: lot?.status || 'draft',
    featured: lot?.featured || false,
    requiresApproval: lot?.requiresApproval || false,
    approvalNotes: lot?.approval?.notes || '',
    videoUrl: lot?.videoUrl || '',
    metadata: lot?.metadata || {},
    images: normalizeImages(lot?.images || []),
  }));

  const [attributeRows, setAttributeRows] = useState(() =>
    buildAttributeRows(lot?.attributes)
  );
  const [showAI, setShowAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingIntent, setSavingIntent] = useState('save');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [galleryState, setGalleryState] = useState({ open: false, index: 0 });

  const catalogActions = useCatalogAdminActions();

  useEffect(() => {
    if (!lot) return;
    setFormData({
      lotNumber: lot?.lotNumber || '',
      title: lot?.title || '',
      subtitle: lot?.subtitle || '',
      companyCategory: lot?.companyCategory || '',
      category: lot?.category || '',
      descriptionHtml: lot?.descriptionHtml || lot?.description || '',
      additionalDescriptionHtml:
        lot?.additionalDescriptionHtml || lot?.additionalDescription || '',
      quantity: lot?.quantity || 1,
      estimateLow: lot?.estimateLow || 0,
      estimateHigh: lot?.estimateHigh || 0,
      startingBid: lot?.startingBid || 0,
      reservePrice: lot?.reservePrice || 0,
      status: lot?.status || 'draft',
      featured: lot?.featured || false,
      requiresApproval: lot?.requiresApproval || false,
      approvalNotes: lot?.approval?.notes || '',
      videoUrl: lot?.videoUrl || '',
      metadata: lot?.metadata || {},
      images: normalizeImages(lot?.images || []),
    });
    setAttributeRows(buildAttributeRows(lot?.attributes));
  }, [lot]);

  const hasAdvancedNavigation = navigation?.hasPrevious || navigation?.hasNext;

  const pendingApproval = useMemo(() => {
    if (!formData.requiresApproval) {
      return false;
    }
    const status = lot?.approval?.status;
    return !status || status === 'pending';
  }, [formData.requiresApproval, lot?.approval?.status]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAttributeRowChange = (id, key, value) => {
    setAttributeRows((rows) =>
      rows.map((row) => {
        if (row.id !== id) {
          return row;
        }
        if (key === 'key') {
          return { ...row, key: value };
        }
        return { ...row, value };
      })
    );
  };

  const handleAttributeAdd = () => {
    setAttributeRows((rows) => [
      ...rows,
      { id: randomId(), key: '', value: '' },
    ]);
  };

  const handleAttributeRemove = (id) => {
    setAttributeRows((rows) => rows.filter((row) => row.id !== id));
  };

  const handleMediaChange = (media) => {
    setFormData((prev) => ({ ...prev, images: media }));
  };

  const handleSetPrimaryImage = (image, index) => {
    const next = [...formData.images];
    const [selected] = next.splice(index, 1);
    next.unshift(selected);
    setFormData((prev) => ({
      ...prev,
      images: next.map((item, idx) => ({ ...item, order: idx + 1 })),
    }));
    setSuccess('Primary photo updated (save lot to persist).');
  };

  const handleDownloadAll = async () => {
    try {
      await catalogActions.exportImages({
        auctionId: lot?.auctionId || 'preview',
        lotId: lot?._id,
      });
      setSuccess('Photo export requested. Connect backend to provide download link.');
    } catch (err) {
      console.error(err);
      setError('Unable to request export. Integrate backend to enable this action.');
    }
  };

  const handleMoveImage = async (image) => {
    try {
      await catalogActions.requestPhotoAction({
        action: 'moveBetweenLots',
        lotId: lot?._id,
        imageId: image.id,
      });
      setSuccess('Move photo request queued. Hook backend endpoints to complete transfer.');
    } catch (err) {
      console.error(err);
      setError('Failed to queue move action (stub).');
    }
  };

  const openGallery = (index) => setGalleryState({ open: true, index });
  const closeGallery = () => setGalleryState({ open: false, index: 0 });

  const handleGalleryDelete = (_image, index) => {
    const next = formData.images.filter((_, idx) => idx !== index);
    setFormData((prev) => ({
      ...prev,
      images: next.map((item, idx) => ({ ...item, order: idx + 1 })),
    }));
    setSuccess('Photo removed (save lot to confirm).');
  };

  const handleAIGenerate = (draft) => {
    setFormData((prev) => ({
      ...prev,
      title: draft.title || prev.title,
      subtitle: draft.subtitle || prev.subtitle,
      descriptionHtml: draft.description || prev.descriptionHtml,
      additionalDescriptionHtml:
        draft.additionalDescription || prev.additionalDescriptionHtml,
      category: draft.category || prev.category,
      estimateLow: draft.estimateLow || prev.estimateLow,
      estimateHigh: draft.estimateHigh || prev.estimateHigh,
      metadata: {
        ...(prev.metadata || {}),
        tags: draft.tags || [],
      },
    }));
    if (draft.attributes) {
      setAttributeRows(buildAttributeRows(draft.attributes));
    }
    setShowAI(false);
  };

  const handleSubmit = async (intent = 'save') => {
    if (saving) {
      return;
    }

    setSaving(true);
    setSavingIntent(intent);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        images: formData.images.map((image, index) => ({
          url: image.url,
          caption: image.caption || '',
          order: index + 1,
        })),
        attributes: buildAttributeMap(attributeRows),
        descriptionText: stripHtml(formData.descriptionHtml),
        additionalDescriptionText: stripHtml(formData.additionalDescriptionHtml),
      };

      await onSubmit(payload, intent);
      setSuccess('Lot saved successfully.');
    } catch (err) {
      console.error('Error saving lot:', err);
      setError(err?.message || 'Failed to save lot.');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-300 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500 text-green-300 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="bg-gray-800 p-6 rounded-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <p className="text-sm text-gray-400">
              Core lot details as displayed to bidders.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAI(true)}
            className="self-start md:self-center bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium"
          >
            🤖 AI Assist
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Lot Number *</label>
            <input
              type="text"
              value={formData.lotNumber}
              onChange={(e) => handleFieldChange('lotNumber', e.target.value)}
              required
              maxLength={32}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company Category</label>
            <input
              type="text"
              value={formData.companyCategory}
              onChange={(e) => handleFieldChange('companyCategory', e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleFieldChange('category', e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Lot Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            required
            maxLength={100}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Limit 100 characters. Shown in catalog list view.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subtitle</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => handleFieldChange('subtitle', e.target.value)}
            maxLength={200}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <RichTextEditor
            value={formData.descriptionHtml}
            onChange={(value) => handleFieldChange('descriptionHtml', value)}
            placeholder="Provide a detailed description, condition notes, measurements, provenance, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Additional Description</label>
          <RichTextEditor
            value={formData.additionalDescriptionHtml}
            onChange={(value) => handleFieldChange('additionalDescriptionHtml', value)}
            placeholder="Optional supplementary details displayed on lot detail view."
          />
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">Pricing & Quantity</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              min={1}
              onChange={(e) =>
                handleFieldChange('quantity', Math.max(1, parseInt(e.target.value || '1', 10)))
              }
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estimate Low ($)</label>
            <input
              type="number"
              value={formData.estimateLow}
              min={0}
              onChange={(e) =>
                handleFieldChange('estimateLow', parseFloat(e.target.value) || 0)
              }
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estimate High ($)</label>
            <input
              type="number"
              value={formData.estimateHigh}
              min={formData.estimateLow}
              onChange={(e) =>
                handleFieldChange('estimateHigh', parseFloat(e.target.value) || 0)
              }
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Starting Bid ($)</label>
            <input
              type="number"
              value={formData.startingBid}
              min={0}
              onChange={(e) =>
                handleFieldChange('startingBid', parseFloat(e.target.value) || 0)
              }
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reserve ($)</label>
            <input
              type="number"
              value={formData.reservePrice}
              min={formData.startingBid}
              onChange={(e) =>
                handleFieldChange('reservePrice', parseFloat(e.target.value) || 0)
              }
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">Media</h2>
        <MediaManager
          images={formData.images}
          onChange={handleMediaChange}
          onOpenGallery={openGallery}
          onRequestMove={handleMoveImage}
          onRequestDownload={handleDownloadAll}
          onSetPrimary={handleSetPrimaryImage}
        />
        <div>
          <label className="block text-sm font-medium mb-1">Video URL</label>
          <input
            type="url"
            value={formData.videoUrl}
            onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
            placeholder="https://example.com/video"
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Attributes</h2>
            <p className="text-sm text-gray-400">
              Custom metadata such as maker, year, dimensions, etc.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAttributeAdd}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm font-medium"
          >
            + Add Attribute
          </button>
        </div>
        <div className="space-y-3">
          {attributeRows.length === 0 && (
            <div className="text-sm text-gray-400 border border-dashed border-gray-700 rounded p-4 text-center">
              No attributes defined yet.
            </div>
          )}
          {attributeRows.map((row) => (
            <div key={row.id} className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <input
                type="text"
                value={row.key}
                onChange={(e) => handleAttributeRowChange(row.id, 'key', e.target.value)}
                placeholder="Attribute name (e.g. Maker)"
                className="md:col-span-4 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
              />
              <input
                type="text"
                value={row.value}
                onChange={(e) =>
                  handleAttributeRowChange(row.id, 'value', e.target.value)
                }
                placeholder="Value"
                className="md:col-span-7 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={() => handleAttributeRemove(row.id)}
                className="md:col-span-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">Workflow & Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleFieldChange('featured', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Featured Lot</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.requiresApproval}
                onChange={(e) =>
                  handleFieldChange('requiresApproval', e.target.checked)
                }
                className="w-4 h-4"
              />
              <div>
                <span className="text-sm block">Requires Admin Approval</span>
                <span className="text-xs text-gray-400">
                  Lot changes remain pending until approved.
                </span>
              </div>
            </div>
            {formData.requiresApproval && (
              <div>
                <label className="block text-sm font-medium mb-1">Approval Notes</label>
                <textarea
                  rows={3}
                  value={formData.approvalNotes}
                  onChange={(e) => handleFieldChange('approvalNotes', e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
                  placeholder="Internal notes visible to approvers"
                />
                {pendingApproval && (
                  <p className="text-xs text-yellow-400 mt-1">
                    Pending approval – this lot will remain hidden until approved.
                  </p>
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleFieldChange('status', e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending Approval</option>
              <option value="published">Published</option>
              <option value="sold">Sold</option>
              <option value="passed">Passed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Status controls bidder visibility and reporting.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleSubmit('save')}
            className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg font-medium disabled:opacity-60"
            disabled={saving && savingIntent === 'save'}
          >
            {saving && savingIntent === 'save' ? 'Saving…' : 'Save Lot'}
          </button>
          {hasAdvancedNavigation && (
            <>
              <button
                type="button"
                onClick={() => handleSubmit('savePrevious')}
                disabled={!navigation?.hasPrevious || (saving && savingIntent !== 'savePrevious')}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium disabled:opacity-40"
              >
                {saving && savingIntent === 'savePrevious'
                  ? 'Saving…'
                  : 'Save & Previous'}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('saveNext')}
                disabled={!navigation?.hasNext || (saving && savingIntent !== 'saveNext')}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium disabled:opacity-40"
              >
                {saving && savingIntent === 'saveNext' ? 'Saving…' : 'Save & Next'}
              </button>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-transparent border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg text-sm text-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>

      {showAI && (
        <AIAssistPanel
          images={formData.images}
          onGenerate={handleAIGenerate}
          onClose={() => setShowAI(false)}
        />
      )}

      <PhotoGalleryModal
        open={galleryState.open}
        images={formData.images}
        initialIndex={galleryState.index}
        onClose={closeGallery}
        onSetPrimary={handleSetPrimaryImage}
        onRequestMove={handleMoveImage}
        onDelete={handleGalleryDelete}
      />
    </div>
  );
}








