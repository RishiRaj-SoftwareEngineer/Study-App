import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    feedbackType: {
      type: String,
      enum: ["general", "bug", "feature", "content", "other"],
      default: "general",
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    experience: { type: String, default: "" },
    liked: { type: String, default: "" },
    improvements: { type: String, default: "" },
    newFeatures: { type: String, default: "" },
    wouldRecommend: { type: Boolean, default: null },
    additionalComments: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
