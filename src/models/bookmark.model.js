import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
      match: [
        /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/,
        "Please enter a valid URL",
      ],
    },

    title: {
      type: String,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: String,
    content: String,
    image: {
      type: String,
      default: "",
    },
    embedding: {
      type: [Number],
    },

    type: {
      type: String,
      enum: ["video", "article", "image", "pdf", "tweet", "other"],
      default: "other",
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    folder: {
      type: String,
      default: "general",
    },
  },
  {
    timestamps: true, // 🔥 createdAt & updatedAt auto handle
  },
);

// 🚀 Indexing for fast queries
bookmarkSchema.index({ user: 1 });
bookmarkSchema.index({ tags: 1 });

// 🔍 Optional: text search (advanced feature)
bookmarkSchema.index({ title: "text", tags: "text" });

const bookmarkModel = mongoose.model("Bookmark", bookmarkSchema);

export default bookmarkModel;
