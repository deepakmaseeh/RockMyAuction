import mongoose from "mongoose";

const catalogueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String, // URL to cover image
  },
  auctionDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Allow null for demo purposes
    default: null, // Explicitly set default to null
    validate: {
      validator: function(v) {
        // Allow null/undefined or valid ObjectId
        return v === null || v === undefined || mongoose.Types.ObjectId.isValid(v);
      },
      message: 'createdBy must be a valid ObjectId or null'
    },
    set: function(v) {
      // Convert invalid values to null
      if (!v || !mongoose.Types.ObjectId.isValid(v)) {
        return null;
      }
      return v;
    }
  },
  lots: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lot"
  }],
  metadata: {
    totalLots: {
      type: Number,
      default: 0
    },
    estimatedValue: {
      type: Number,
      default: 0
    }
  }
}, { timestamps: true });

// Update metadata before saving
catalogueSchema.pre('save', function(next) {
  if (this.lots && Array.isArray(this.lots)) {
    this.metadata.totalLots = this.lots.length;
  }
  
  // Ensure createdBy is either a valid ObjectId or null/undefined
  if (this.createdBy && !mongoose.Types.ObjectId.isValid(this.createdBy)) {
    this.createdBy = null;
  }
  
  next();
});

export default mongoose.models.Catalogue || mongoose.model("Catalogue", catalogueSchema);

