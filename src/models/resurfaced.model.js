import mongoose from "mongoose";

const resurfacedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bookmark",
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Resurfaced = mongoose.model("Resurfaced", resurfacedSchema);

export default Resurfaced;
