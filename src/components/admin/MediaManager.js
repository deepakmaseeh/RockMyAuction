'use client';

import { useMemo, useRef, useState } from 'react';

const randomId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `media-${Math.random().toString(36).slice(2, 10)}`;

function normalizeMediaItems(images = []) {
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
      id: image.id || randomId(),
      url: image.url || '',
      caption: image.caption || '',
      order: image.order || index + 1,
    };
  });
}

export default function MediaManager({
  images = [],
  onChange,
  onOpenGallery,
  onRequestMove,
  onRequestDownload,
  onSetPrimary,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const fileInputRef = useRef(null);
  const normalized = useMemo(() => normalizeMediaItems(images), [images]);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const nextMedia = [...normalized];

    await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            if (!file.type.startsWith('image/')) {
              resolve();
              return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
              nextMedia.push({
                id: randomId(),
                url: e.target?.result || '',
                caption: file.name.replace(/\.[^/.]+$/, ''),
                order: nextMedia.length + 1,
              });
              resolve();
            };
            reader.readAsDataURL(file);
          })
      )
    );

    onChange(nextMedia);
    event.target.value = '';
  };

  const handleRemove = (index) => {
    const nextMedia = normalized.filter((_, i) => i !== index).map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));
    onChange(nextMedia);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, dropIndex) => {
    event.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const nextMedia = [...normalized];
    const [dragged] = nextMedia.splice(draggedIndex, 1);
    nextMedia.splice(dropIndex, 0, dragged);

    const reindexed = nextMedia.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    onChange(reindexed);
    setDraggedIndex(null);
  };

  const handleCaptionChange = (index, caption) => {
    const nextMedia = normalized.map((item, idx) =>
      idx === index ? { ...item, caption } : item
    );
    onChange(nextMedia);
  };

  const handleSetPrimary = (index) => {
    if (typeof onSetPrimary === 'function') {
      onSetPrimary(normalized[index], index);
      return;
    }

    const next = [...normalized];
    const [selected] = next.splice(index, 1);
    next.unshift({ ...selected, order: 1 });
    const reindexed = next.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));
    onChange(reindexed);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add Images
        </button>
        <button
          type="button"
          onClick={() => {
            if (typeof onOpenGallery === 'function') {
              onOpenGallery(0);
            }
          }}
          className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg text-xs text-gray-200"
        >
          Manage gallery
        </button>
        <button
          type="button"
          onClick={() => onRequestDownload?.(images)}
          className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg text-xs text-gray-200"
        >
          Download all
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {normalized.map((image, index) => (
          <div
            key={image.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={(event) => handleDrop(event, index)}
            className="bg-gray-700/70 border border-gray-600 rounded-lg overflow-hidden group flex flex-col"
          >
            <div className="relative">
              <img
                src={image.url}
                alt={image.caption || `Lot image ${index + 1}`}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    className="rounded-full bg-orange-500/80 px-2 py-1 text-[11px] text-white hover:bg-orange-500"
                  >
                    Primary
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="absolute bottom-2 left-2 flex gap-2">
                <span className="rounded bg-black/60 px-2 py-1 text-xs text-white">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => onRequestMove?.(image)}
                  className="rounded bg-black/50 px-2 py-1 text-[11px] text-gray-100 hover:bg-black/70"
                >
                  Move
                </button>
                <button
                  type="button"
                  onClick={() => onOpenGallery?.(index)}
                  className="rounded bg-black/50 px-2 py-1 text-[11px] text-gray-100 hover:bg-black/70"
                >
                  View
                </button>
              </div>
            </div>
            <div className="p-3 border-t border-gray-600 bg-gray-800/60">
              <label className="text-[11px] uppercase tracking-wide text-gray-500">
                Caption
              </label>
              <input
                type="text"
                value={image.caption}
                onChange={(e) => handleCaptionChange(index, e.target.value)}
                placeholder="Add a caption"
                className="mt-1 w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      {normalized.length === 0 && (
        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-700 rounded-lg">
          No images added. Click “Add Images” to upload.
        </div>
      )}

      {onRequestDownload && normalized.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-3 text-xs text-gray-400">
          <span>
            Tip: drag to reorder photos. Use “Manage gallery” to review details and move images
            between catalogs once your backend is connected.
          </span>
          <span className="rounded-full bg-gray-800 px-3 py-1 text-[11px] text-gray-300">
                {index + 1}
          </span>
        </div>
      )}
    </div>
  );
}








