import mongoose from 'mongoose';

const eventLogSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: ['Auction', 'Lot', 'Consignor', 'User'],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    previousData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

eventLogSchema.index({ entityType: 1, entityId: 1 });

const EventLog =
  mongoose.models.EventLog || mongoose.model('EventLog', eventLogSchema);

export default EventLog;

