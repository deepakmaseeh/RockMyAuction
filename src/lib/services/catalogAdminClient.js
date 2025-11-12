'use client';

const delay = (result, ms = 500) =>
  new Promise((resolve) => setTimeout(() => resolve(result), ms));

const mockCatalogs = [
  { id: 'mock-spring', name: 'Spring Estate Auction', date: 'Mar 14, 2025' },
  { id: 'mock-summer', name: 'Summer Collector Series', date: 'Jun 09, 2025' },
  { id: 'mock-fall', name: 'Fall Premium Lots', date: 'Sep 21, 2025' },
];

export function createCatalogAdminClient() {
  return {
    async previewCatalog({ auctionId, lots = [] }) {
      return delay({
        auctionId,
        lots,
        generatedAt: new Date().toISOString(),
      });
    },

    async exportCatalog({ auctionId, format }) {
      return delay({
        auctionId,
        format,
        downloadUrl: '#',
        message: `Export job queued for ${format?.toUpperCase?.() || 'CSV'}.`,
      });
    },

    async exportImages({ auctionId }) {
      return delay({
        auctionId,
        downloadUrl: '#',
        message: 'Image ZIP export queued.',
      });
    },

    async sendToPlatform({ auctionId, platform }) {
      return delay({
        auctionId,
        platform,
        status: 'queued',
        message: `Sync to ${platform} has been queued.`,
      });
    },

    async transferLots({ mode, lotIds = [], targetCatalogId, includeMedia }) {
      return delay({
        mode,
        lotIds,
        targetCatalogId,
        includeMedia,
        jobId: `${mode}-${Date.now()}`,
        message: `Request to ${mode} ${lotIds.length} lot(s) submitted.`,
      });
    },

    async fetchAvailableCatalogs(currentAuctionId) {
      return delay(
        mockCatalogs.filter((catalog) => catalog.id !== currentAuctionId)
      );
    },

    async fetchApprovalQueue() {
      return delay([
        {
          id: 'queue-1',
          lotNumber: '102A',
          title: 'Victorian Walnut Sideboard',
          submittedBy: 'andrew.h@demo.com',
          submittedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          status: 'pending',
        },
        {
          id: 'queue-2',
          lotNumber: '204',
          title: 'Vintage Rolex GMT-Master',
          submittedBy: 'harper.l@demo.com',
          submittedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          status: 'pending',
        },
      ]);
    },

    async resolveApproval({ lotId, decision }) {
      return delay({
        lotId,
        decision,
        resolvedAt: new Date().toISOString(),
      });
    },

    async requestPhotoAction({ action, lotId, imageId }) {
      return delay({
        action,
        lotId,
        imageId,
        message: `Photo action "${action}" queued.`,
      });
    },
  };
}

