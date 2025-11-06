import mongoose from "mongoose";

const consignorSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

export default mongoose.models.Consignor || mongoose.model("Consignor", consignorSchema);





