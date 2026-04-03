import mongoose from "mongoose";

const EdgeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },

    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bookmark",
      required: true,
    },

    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bookmark",
      required: true,
    },

    weight: {
      type: Number,
      default: 1,
    },

    type: {
      type: String,
      default: "semantic",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Edge", EdgeSchema);
