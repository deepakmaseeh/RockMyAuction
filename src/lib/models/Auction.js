import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true
  },
  startAt: {
    type: Date,
    required: true
  },
  endAt: {
    type: Date,
    required: true
  },
  timezone: {
    type: String,
    default: "UTC"
  },
  buyerPremiumPct: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  termsHtml: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["draft", "scheduled", "live", "closed"],
    default: "draft",
    index: true
  },
  createdById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  }
}, { timestamps: true });

// Indexes
auctionSchema.index({ slug: 1 }, { unique: true });
auctionSchema.index({ status: 1, startAt: 1 });
auctionSchema.index({ endAt: 1 });

export default mongoose.models.Auction || mongoose.model("Auction", auctionSchema);
