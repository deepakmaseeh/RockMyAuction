import asyncHandler from 'express-async-handler';
import Auction from '../models/Auction.js';
import Lot from '../models/Lot.js';
import EventLog from '../models/EventLog.js';

export const listAuctions = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;

  const query = {};
  if (status) {
    query.status = status;
  }

  const auctions = await Auction.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .lean();

  const total = await Auction.countDocuments(query);

  res.json({
    success: true,
    data: auctions,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const createAuction = asyncHandler(async (req, res) => {
  const { slug, title } = req.body;
  if (!slug || !title) {
    res.status(400);
    throw new Error('Slug and title are required.');
  }

  const existing = await Auction.findOne({ slug });
  if (existing) {
    res.status(409);
    throw new Error('Slug already exists.');
  }

  const auction = await Auction.create({
    ...req.body,
    startAt: req.body.startAt ? new Date(req.body.startAt) : undefined,
    endAt: req.body.endAt ? new Date(req.body.endAt) : undefined,
  });

  await EventLog.create({
    entityType: 'Auction',
    entityId: auction._id,
    action: 'create',
    data: { title: auction.title },
  });

  res.status(201).json({ success: true, data: auction });
});

export const getAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id).lean();
  if (!auction) {
    res.status(404);
    throw new Error('Auction not found.');
  }

  const lotsCount = await Lot.countDocuments({ auctionId: auction._id });

  res.json({
    success: true,
    data: { ...auction, lotsCount },
  });
});

export const updateAuction = asyncHandler(async (req, res) => {
  const previous = await Auction.findById(req.params.id).lean();
  if (!previous) {
    res.status(404);
    throw new Error('Auction not found.');
  }

  const updated = await Auction.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      startAt: req.body.startAt ? new Date(req.body.startAt) : undefined,
      endAt: req.body.endAt ? new Date(req.body.endAt) : undefined,
    },
    { new: true, runValidators: true }
  );

  await EventLog.create({
    entityType: 'Auction',
    entityId: updated._id,
    action: 'update',
    previousData: previous,
    data: req.body,
  });

  res.json({ success: true, data: updated });
});

export const deleteAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findByIdAndDelete(req.params.id);
  if (!auction) {
    res.status(404);
    throw new Error('Auction not found.');
  }

  await Lot.deleteMany({ auctionId: req.params.id });

  await EventLog.create({
    entityType: 'Auction',
    entityId: req.params.id,
    action: 'delete',
    data: { title: auction.title },
  });

  res.json({ success: true, message: 'Auction deleted successfully.' });
});

