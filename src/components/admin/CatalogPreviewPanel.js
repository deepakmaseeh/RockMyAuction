'use client';

export default function CatalogPreviewPanel({
  open,
  auction,
  lots = [],
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60">
      <div className="h-full w-full max-w-3xl overflow-y-auto border-l border-gray-800 bg-[#0d0d11] shadow-2xl">
        <header className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Catalog Preview</h2>
            <p className="text-sm text-gray-400">
              This preview uses in-memory data. Connect your backend export to replace this view.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-500 transition hover:text-white"
          >
            ×
          </button>
        </header>

        <section className="border-b border-gray-800 px-6 py-5">
          <h3 className="text-xl font-semibold text-white">{auction?.title}</h3>
          <div className="mt-2 text-sm text-gray-300">
            <p>{auction?.description || 'No catalog description provided yet.'}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
              <span>Status: {auction?.status ?? 'draft'}</span>
              {auction?.startAt && (
                <span>
                  Starts {new Date(auction.startAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              )}
              {auction?.endAt && (
                <span>
                  Ends {new Date(auction.endAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="px-6 py-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              {lots.length} lot{lots.length === 1 ? '' : 's'}
            </h4>
            <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300">
              Preview-only
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {lots.map((lot) => (
              <article
                key={lot._id || lot.lotNumber}
                className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 shadow-inner"
              >
                <header className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Lot {lot.lotNumber || '—'}
                    </p>
                    <h5 className="text-lg font-semibold text-white">
                      {lot.title || 'Untitled lot'}
                    </h5>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="rounded-full bg-gray-800 px-2 py-1">
                      {lot.status || 'draft'}
                    </span>
                    {lot.featured && (
                      <span className="rounded-full bg-yellow-600/20 px-2 py-1 text-yellow-300">
                        Featured
                      </span>
                    )}
                  </div>
                </header>

                <div className="mt-3 grid gap-4 md:grid-cols-5">
                  <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900 md:col-span-2">
                    <div className="h-40 bg-gray-950 text-center text-xs text-gray-600">
                      <div className="flex h-full flex-col items-center justify-center">
                        <span className="text-sm">Media preview</span>
                        <span className="text-[11px] text-gray-500">
                          Connect backend to render photos.
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <div className="text-sm text-gray-300">
                      <p
                        className="line-clamp-5 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html:
                            lot.descriptionHtml ||
                            lot.descriptionText ||
                            '<em>No description provided yet.</em>',
                        }}
                      />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-gray-400">
                      <div>
                        <span className="font-semibold text-gray-500">Estimate</span>
                        <p className="mt-1 text-sm text-white">
                          ${lot.estimateLow?.toLocaleString?.() || 0} – $
                          {lot.estimateHigh?.toLocaleString?.() || 0}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-500">Starting bid</span>
                        <p className="mt-1 text-sm text-white">
                          ${lot.startingBid?.toLocaleString?.() || 0}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      <span>Categories: </span>
                      <span className="text-gray-300">
                        {[lot.companyCategory, lot.category]
                          .filter(Boolean)
                          .join(' • ') || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {lots.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/40 p-6 text-center text-sm text-gray-500">
                Populate lots to see a live preview. This space will mirror exactly what bidders see.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

