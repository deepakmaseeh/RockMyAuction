import mongoose from "mongoose";

const lotImageSchema = new mongoose.Schema({
  lotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lot",
    required: true,
    index: true
  },
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ""
  },
  sortOrder: {
    type: Number,
    default: 0,
    required: true
  }
}, { timestamps: true });

// Compound index for efficient lot image queries
lotImageSchema.index({ lotId: 1, sortOrder: 1 });

export default mongoose.models.LotImage || mongoose.model("LotImage", lotImageSchema);





