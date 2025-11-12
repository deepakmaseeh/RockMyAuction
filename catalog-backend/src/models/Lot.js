import mongoose from 'mongoose';

const lotImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    order: { type: Number, default: 0 },
    assetId: { type: String },
    source: { type: String, enum: ['upload', 'url', 'external'], default: 'url' },
  },
  { _id: false }
);

const lotSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auction',
      required: true,
      index: true,
    },
    lotNumber: {
      type: String,
      required: true,
      trim: true,
    },
    sequence: {
      type: Number,
      default: 0,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    companyCategory: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    descriptionHtml: {
      type: String,
      default: '',
    },
    additionalDescriptionHtml: {
      type: String,
      default: '',
    },
    descriptionText: {
      type: String,
      default: '',
    },
    additionalDescriptionText: {
      type: String,
      default: '',
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    estimateLow: {
      type: Number,
      default: 0,
      min: 0,
    },
    estimateHigh: {
      type: Number,
      default: 0,
      min: 0,
    },
    startingBid: {
      type: Number,
      default: 0,
      min: 0,
    },
    reservePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'sold', 'passed', 'cancelled'],
      default: 'draft',
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    requiresApproval: {
      type: Boolean,
      default: false,
    },
    approval: {
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved',
      },
      reviewedById: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reviewedAt: {
        type: Date,
      },
      notes: {
        type: String,
        default: '',
      },
    },
    cancelledAt: {
      type: Date,
    },
    cancelledById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    attributes: {
      type: Map,
      of: String,
      default: {},
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    images: {
      type: [lotImageSchema],
      default: [],
    },
    documents: [
      {
        url: { type: String, required: true },
        label: { type: String, default: '' },
        order: { type: Number, default: 0 },
      },
    ],
    videoUrl: {
      type: String,
      default: '',
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastSequencedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sequencedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

lotSchema.index({ auctionId: 1, lotNumber: 1 }, { unique: true });
lotSchema.index({ auctionId: 1, sequence: 1 });
lotSchema.index({ auctionId: 1, status: 1 });

lotSchema.pre('save', async function assignSequence(next) {
  if (this.sequence && this.sequence > 0) {
    return next();
  }

  try {
    const LotModel = this.constructor;
    const latest = await LotModel.findOne({ auctionId: this.auctionId })
      .sort({ sequence: -1 })
      .select('sequence')
      .lean();

    this.sequence = latest?.sequence ? latest.sequence + 1 : 1;
    next();
  } catch (error) {
    next(error);
  }
});

const Lot = mongoose.models.Lot || mongoose.model('Lot', lotSchema);

export default Lot;

