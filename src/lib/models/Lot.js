import mongoose from "mongoose";

const lotSchema = new mongoose.Schema({
  // Auction relationship (new, preferred)
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: false,
    index: true
  },
  // Catalogue relationship (legacy, for backward compatibility)
  catalogue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Catalogue",
    required: false,
    index: true
  },
  lotNumber: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80,
    index: true
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true
  },
  conditionReport: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true,
    index: true
  },
  attributes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  estimateLow: {
    type: Number,
    default: 0,
    min: 0
  },
  estimateHigh: {
    type: Number,
    default: 0,
    min: 0
  },
  startingBid: {
    type: Number,
    default: 0,
    min: 0
  },
  reservePrice: {
    type: Number,
    default: 0,
    min: 0
  },
  incrementScheme: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  status: {
    type: String,
    enum: ["draft", "published", "sold", "passed"],
    default: "draft",
    index: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  seoSlug: {
    type: String,
    trim: true,
    index: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  // Legacy fields for backward compatibility
  images: [{
    type: String
  }],
  condition: {
    type: String,
    enum: ["excellent", "very-good", "good", "fair", "poor"],
    default: "good"
  },
  // Legacy estimatedValue - maps to estimateHigh
  estimatedValue: {
    type: Number,
    default: 0
  },
  // Legacy startingPrice - maps to startingBid
  startingPrice: {
    type: Number,
    default: 0
  },
  provenance: {
    type: String,
    trim: true
  },
  dimensions: {
    height: Number,
    width: Number,
    depth: Number,
    unit: {
      type: String,
      enum: ["cm", "inches"],
      default: "cm"
    }
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ["kg", "grams", "lbs", "oz"],
      default: "kg"
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  metadata: {
    notes: String,
    tags: [String]
  }
}, { timestamps: true });

// Compound indexes
lotSchema.index({ auctionId: 1, lotNumber: 1 }, { unique: true, sparse: true });
lotSchema.index({ catalogue: 1, lotNumber: 1 }, { unique: true, sparse: true });
lotSchema.index({ seoSlug: 1 }, { unique: true, sparse: true });
lotSchema.index({ status: 1, featured: 1 });
lotSchema.index({ category: 1, status: 1 });

// Pre-save hook to sync legacy fields
lotSchema.pre('save', function(next) {
  // Sync estimateHigh to estimatedValue if not set
  if (this.estimateHigh && !this.estimatedValue) {
    this.estimatedValue = this.estimateHigh;
  }
  // Sync startingBid to startingPrice if not set
  if (this.startingBid && !this.startingPrice) {
    this.startingPrice = this.startingBid;
  }
  next();
});

export default mongoose.models.Lot || mongoose.model("Lot", lotSchema);

