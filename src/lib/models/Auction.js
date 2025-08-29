// import mongoose from "mongoose";

// const auctionSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   image : String,  
//   category: String,
//   startingBid: Number,
//   reservePrice: Number,
//   quantity: Number,
//   startTime: Date,
//   endTime: Date,
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
// }, { timestamps: true });

// export default mongoose.models.Auction || mongoose.model("Auction", auctionSchema);
      
import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,       // match backend field
  category: String,
  startingPrice: Number,  // match backend
  currentPrice: Number,   // optional
  quantity: Number,
  startTime: Date,
  endTime: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active",
  }
}, { timestamps: true });

export default mongoose.models.Auction || mongoose.model("Auction", auctionSchema);