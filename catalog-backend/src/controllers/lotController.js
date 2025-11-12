import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import multer from 'multer';

import Lot from '../models/Lot.js';
import Auction from '../models/Auction.js';
import EventLog from '../models/EventLog.js';
import { parseCsvBuffer, mapCsvRowToLot, lotsToCsv } from '../utils/csv.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

export const lotsUploadMiddleware = upload.single('file');

const sanitizeLotPayload = (payload) => {
  const allowed = [
    'lotNumber',
    'title',
    'subtitle',
    'companyCategory',
    'category',
    'descriptionHtml',
    'additionalDescriptionHtml',
    'descriptionText',
    'additionalDescriptionText',
    'quantity',
    'estimateLow',
    'estimateHigh',
    'startingBid',
    'reservePrice',
    'status',
    'featured',
    'requiresApproval',
    'attributes',
    'metadata',
    'images',
    'documents',
    'videoUrl',
    'sequence',
  ];

  return allowed.reduce((acc, key) => {
    if (payload[key] !== undefined) {
      acc[key] = payload[key];
    }
    return acc;
  }, {});
};

export const listLots = asyncHandler(async (req, res) => {
  const { sort = 'sequence', order = 'asc', status, q, includeArchived } = req.query;

  const auctionId = req.params.id;
  const auction = await Auction.findById(auctionId).select('_id');
  if (!auction) {
    res.status(404);
    throw new Error('Auction not found.');
  }

  const query = { auctionId };
  if (!includeArchived) {
    query.isArchived = { $ne: true };
  }
  if (status && status !== 'all') {
    query.status = status;
  }
  if (q) {
    query.$or = [
      { lotNumber: { $regex: q, $options: 'i' } },
      { title: { $regex: q, $options: 'i' } },
      { descriptionText: { $regex: q, $options: 'i' } },
    ];
  }

  const sortMap = {
    sequence: { sequence: order === 'desc' ? -1 : 1, lotNumber: 1 },
    lotNumber: { lotNumber: order === 'desc' ? -1 : 1 },
    title: { title: order === 'desc' ? -1 : 1 },
    status: { status: order === 'desc' ? -1 : 1, sequence: 1 },
  };

  const lots = await Lot.find(query).sort(sortMap[sort] || sortMap.sequence).lean();

  res.json({
    success: true,
    data: lots.map((lot) => ({
      ...lot,
      description: lot.descriptionHtml || lot.descriptionText || '',
      additionalDescription: lot.additionalDescriptionHtml || lot.additionalDescriptionText || '',
    })),
  });
});

export const createLot = asyncHandler(async (req, res) => {
  const auctionId = req.params.id;
  const auction = await Auction.findById(auctionId).select('_id title');
  if (!auction) {
    res.status(404);
    throw new Error('Auction not found.');
  }

  const payload = sanitizeLotPayload(req.body);
  if (!payload.lotNumber || !payload.title) {
    res.status(400);
    throw new Error('Lot number and title are required.');
  }

  const duplicate = await Lot.findOne({ auctionId, lotNumber: payload.lotNumber });
  if (duplicate) {
    res.status(409);
    throw new Error('Lot number already exists for this auction.');
  }

  const lot = await Lot.create({
    ...payload,
    auctionId,
    approval: {
      status: payload.requiresApproval ? 'pending' : 'approved',
      notes: payload.approvalNotes || '',
    },
  });

  await EventLog.create({
    entityType: 'Lot',
    entityId: lot._id,
    action: 'create',
    data: {
      auctionId,
      lotNumber: lot.lotNumber,
      title: lot.title,
    },
  });

  res.status(201).json({ success: true, data: lot });
});

export const getLot = asyncHandler(async (req, res) => {
  const lot = await Lot.findById(req.params.lotId).lean();
  if (!lot) {
    res.status(404);
    throw new Error('Lot not found.');
  }

  res.json({
    success: true,
    data: {
      ...lot,
      description: lot.descriptionHtml || lot.descriptionText || '',
      additionalDescription: lot.additionalDescriptionHtml || lot.additionalDescriptionText || '',
    },
  });
});

export const updateLot = asyncHandler(async (req, res) => {
  const lotId = req.params.lotId;
  const existing = await Lot.findById(lotId);
  if (!existing) {
    res.status(404);
    throw new Error('Lot not found.');
  }

  const payload = sanitizeLotPayload(req.body);

  if (payload.lotNumber && payload.lotNumber !== existing.lotNumber) {
    const duplicate = await Lot.findOne({
      auctionId: existing.auctionId,
      lotNumber: payload.lotNumber,
      _id: { $ne: lotId },
    });
    if (duplicate) {
      res.status(409);
      throw new Error('Lot number already exists in this auction.');
    }
  }

  if (payload.requiresApproval === true) {
    payload.approval = {
      ...(payload.approval || existing.approval?.toObject?.() || {}),
      status: 'pending',
    };
  } else if (payload.requiresApproval === false) {
    payload.approval = {
      ...(payload.approval || existing.approval?.toObject?.() || {}),
      status: payload.approval?.status || 'approved',
    };
  }

  if (payload.approvalNotes !== undefined) {
    payload.approval = {
      ...(payload.approval || existing.approval?.toObject?.() || {}),
      notes: payload.approvalNotes,
    };
    delete payload.approvalNotes;
  }

  Object.assign(existing, payload);
  await existing.save();

  await EventLog.create({
    entityType: 'Lot',
    entityId: existing._id,
    action: 'update',
    previousData: {
      lotNumber: existing.lotNumber,
      title: existing.title,
    },
    data: payload,
  });

  res.json({ success: true, data: existing });
});

export const deleteLot = asyncHandler(async (req, res) => {
  const lot = await Lot.findByIdAndDelete(req.params.lotId);
  if (!lot) {
    res.status(404);
    throw new Error('Lot not found.');
  }

  await EventLog.create({
    entityType: 'Lot',
    entityId: req.params.lotId,
    action: 'delete',
    data: {
      auctionId: lot.auctionId,
      lotNumber: lot.lotNumber,
    },
  });

  res.json({ success: true, message: 'Lot deleted.' });
});

export const bulkLotAction = asyncHandler(async (req, res) => {
  const { action, lotIds = [], field, value } = req.body;
  if (!Array.isArray(lotIds) || lotIds.length === 0) {
    res.status(400);
    throw new Error('lotIds array is required.');
  }

  if (action === 'delete') {
    const lots = await Lot.find({ _id: { $in: lotIds } }).select('_id auctionId lotNumber title');
    await Lot.deleteMany({ _id: { $in: lotIds } });
    await EventLog.insertMany(
      lots.map((lot) => ({
        entityType: 'Lot',
        entityId: lot._id,
        action: 'delete',
        data: { auctionId: lot.auctionId, lotNumber: lot.lotNumber, title: lot.title },
      }))
    );
    return res.json({ success: true, modifiedCount: lotIds.length });
  }

  const buildUpdate = () => {
    switch (action) {
      case 'update_field':
        if (!field) {
          throw new Error('Field is required for update_field action.');
        }
        if (['lotNumber', 'title'].includes(field)) {
          throw new Error('lotNumber/title cannot be bulk edited.');
        }
        if (['estimateLow', 'estimateHigh', 'reservePrice', 'startingBid'].includes(field)) {
          return { [field]: Number(value) || 0 };
        }
        if (field === 'requiresApproval') {
          const requiresApproval = Boolean(value);
          return {
            requiresApproval,
            approval: { status: requiresApproval ? 'pending' : 'approved' },
          };
        }
        if (field === 'featured') {
          return { featured: Boolean(value) };
        }
        return { [field]: value };
      case 'publish':
        return { status: 'published' };
      case 'unpublish':
        return { status: 'draft' };
      case 'feature':
        return { featured: true };
      case 'unfeature':
        return { featured: false };
      case 'mark_sold':
        return { status: 'sold' };
      case 'approve':
        return {
          requiresApproval: false,
          approval: { status: 'approved' },
        };
      case 'reject':
        return {
          approval: {
            status: 'rejected',
            notes: value || '',
          },
        };
      case 'cancel':
        return {
          status: 'cancelled',
          cancelledAt: new Date(),
        };
      default:
        return null;
    }
  };

  const update = buildUpdate();
  if (!update) {
    res.status(400);
    throw new Error(`Unsupported action: ${action}`);
  }

  const result = await Lot.updateMany({ _id: { $in: lotIds } }, { $set: update });

  await EventLog.create({
    entityType: 'Lot',
    entityId: lotIds[0],
    action: 'bulk_update',
    data: { action, field, value, lotIds },
  });

  res.json({ success: true, modifiedCount: result.modifiedCount });
});

export const reorderLots = asyncHandler(async (req, res) => {
  const { auctionId, order = [], updates = [], userId = null } = req.body;
  if (!auctionId) {
    res.status(400);
    throw new Error('auctionId is required.');
  }

  const sequenceUpdates =
    Array.isArray(order) && order.length > 0
      ? order.map((lotId, index) => ({
          lotId,
          sequence: index + 1,
        }))
      : updates;

  if (!Array.isArray(sequenceUpdates) || sequenceUpdates.length === 0) {
    res.status(400);
    throw new Error('No ordering data provided.');
  }

  const lotIds = sequenceUpdates.map((entry) => new mongoose.Types.ObjectId(entry.lotId));
  const lots = await Lot.find({
    _id: { $in: lotIds },
    auctionId,
  }).select('_id');

  if (lots.length !== sequenceUpdates.length) {
    res.status(400);
    throw new Error('One or more lot IDs are invalid or do not belong to the auction.');
  }

  const bulkOps = sequenceUpdates.map(({ lotId, sequence }) => ({
    updateOne: {
      filter: { _id: lotId },
      update: {
        $set: {
          sequence,
          lastSequencedById: userId || null,
          sequencedAt: new Date(),
        },
      },
    },
  }));

  await Lot.bulkWrite(bulkOps);

  await EventLog.create({
    entityType: 'Auction',
    entityId: auctionId,
    action: 'lot_reorder',
    data: { updates: sequenceUpdates },
  });

  res.json({ success: true, updated: sequenceUpdates.length });
});

export const importLots = asyncHandler(async (req, res) => {
  const { dryRun = 'true', auctionId } = req.body;
  if (!auctionId) {
    res.status(400);
    throw new Error('auctionId is required.');
  }
  if (!req.file) {
    res.status(400);
    throw new Error('CSV file is required.');
  }

  const rows = await parseCsvBuffer(req.file.buffer);
  const validLots = [];
  const errors = [];

  rows.forEach((row, index) => {
    try {
      const lotData = mapCsvRowToLot(row);
      if (!lotData.lotNumber) {
        throw new Error('lotNumber is required.');
      }
      if (!lotData.title) {
        throw new Error('title is required.');
      }
      validLots.push({ ...lotData, _rowIndex: index + 2 }); // +2 to account for header + 1-based index
    } catch (error) {
      errors.push({ row: index + 2, message: error.message });
    }
  });

  if (dryRun === 'true') {
    return res.json({
      success: true,
      preview: validLots.slice(0, 5).map(({ _rowIndex, ...lot }) => lot),
      valid: validLots.length,
      invalid: errors.length,
      errors,
    });
  }

  if (validLots.length === 0) {
    res.status(400);
    throw new Error('No valid rows found in CSV.');
  }

  const latest = await Lot.findOne({ auctionId }).sort({ sequence: -1 }).select('sequence');
  let sequence = latest?.sequence || 0;

  const lotsToInsert = validLots.map(({ _rowIndex, ...lot }) => {
    sequence += 1;
    return {
      ...lot,
      auctionId,
      sequence,
      approval: {
        status: lot.requiresApproval ? 'pending' : 'approved',
      },
    };
  });

  const created = await Lot.insertMany(lotsToInsert, { ordered: false });

  res.json({
    success: true,
    imported: created.length,
    failed: errors.length,
    errors,
  });
});

export const exportLots = asyncHandler(async (req, res) => {
  const { auctionId } = req.query;
  if (!auctionId) {
    res.status(400);
    throw new Error('auctionId is required.');
  }

  const lots = await Lot.find({ auctionId }).sort({ sequence: 1 }).lean();
  const csv = lotsToCsv(lots);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="auction-${auctionId}-lots.csv"`);
  res.send(csv);
});

