'use client';

import { useEffect, useState } from 'react';

export default function PhotoGalleryModal({
  open,
  images = [],
  initialIndex = 0,
  onClose,
  onSetPrimary,
  onRequestMove,
  onDelete,
}) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (!open) return;
    setIndex(initialIndex);
  }, [initialIndex, open]);

  if (!open || images.length === 0) {
    return null;
  }

  const image = images[index];

  const goPrev = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goNext = () =>
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80">
      <header className="flex items-center justify-between border-b border-black/50 px-6 py-4">
        <div>
          <h3 className="text-base font-semibold text-white">Photo Manager</h3>
          <p className="text-xs text-gray-400">
            This is a front-end preview. Connect the backend move/copy endpoints to finish the workflow.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-2xl leading-none text-gray-400 transition hover:text-white"
        >
          ×
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            className="rounded-full border border-gray-600 px-4 py-2 text-white hover:border-white"
          >
            ‹
          </button>
          <div className="max-h-[70vh] max-w-[70vw] overflow-hidden rounded-2xl border border-gray-700 bg-black/40">
            <img
              src={image.url}
              alt={image.caption || 'Lot photo'}
              className="max-h-[70vh] max-w-[70vw] object-contain"
            />
          </div>
          <button
            type="button"
            onClick={goNext}
            className="rounded-full border border-gray-600 px-4 py-2 text-white hover:border-white"
          >
            ›
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onSetPrimary?.(image, index)}
            className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-white hover:border-orange-500"
          >
            Set as primary
          </button>
          <button
            type="button"
            onClick={() => onRequestMove?.(image)}
            className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-white hover:border-orange-500"
          >
            Move to another lot
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(image, index)}
            className="rounded-lg border border-red-600 px-4 py-2 text-sm text-red-300 hover:bg-red-600/10"
          >
            Remove photo
          </button>
        </div>
      </div>

      <footer className="border-t border-black/40 bg-black/40 px-6 py-4">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            Photo {index + 1} of {images.length}
          </span>
          <span>{image.caption || 'No caption'}</span>
        </div>
      </footer>
    </div>
  );
}

