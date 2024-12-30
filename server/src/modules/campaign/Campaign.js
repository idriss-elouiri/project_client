import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  adImage: {
    type: String,
  },
  targetFilters: {
    city: String,
    neighborhood: String,
    gender: String,
    ageRange: {
      min: Number,
      max: Number,
    },
    healthStatus: String,
  },
  status: {
    type: String,
    enum: ["draft", "pending", "approved", "rejected", "completed"],
    default: "draft",
  },
  messagesSent: {
    type: Number,
    default: 0,
  },
  messagesDelivered: {
    type: Number,
    default: 0,
  },
  storeVisits: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
