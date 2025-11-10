import mongoose from "mongoose";

const eventLogSchema = new mongoose.Schema({
  entityType: {
    type: String,
    required: true,
    enum: ["Auction", "Lot", "Consignor", "User"],
    index: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: ["create", "update", "delete", "publish", "unpublish", "feature", "unfeature", "move", "renumber"],
    index: true
  },
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  previousData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, { timestamps: true });

// Compound indexes for efficient queries
eventLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
eventLogSchema.index({ actorId: 1, createdAt: -1 });

export default mongoose.models.EventLog || mongoose.model("EventLog", eventLogSchema);






