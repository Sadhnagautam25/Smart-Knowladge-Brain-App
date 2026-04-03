import bookmarkModel from "../models/bookmark.model.js";
import { extractContent } from "../utils/extractContent.js";
import { generateTags } from "../utils/generateTags.js";
import { getEmbedding } from "../utils/getEmbedding.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";
import { processItem } from "../services/graph.service.js";
import edgeModel from "../models/Edge.model.js";

export async function createBookmarkController(req, res, next) {
  try {
    const userId = req.user._id;

    const { url, title, type, tags, folder, favorite } = req.body;

    // ❌ Validation FIRST
    if (!url) {
      const error = new Error("URL is required");
      error.statusCode = 400;
      return next(error);
    }

    // 🔥 Extract metadata
    const extracted = await extractContent(url);

    const finalContent =
      extracted.content || extracted.description || extracted.title || "";

    // 🔥 SAFE COMBINED TEXT
    const combinedText = `
      ${title || extracted.title || ""}
      ${extracted.description || ""}
      ${finalContent || ""}
    `.trim();

    // 🔥 AUTO TAGS
    let autoTags = generateTags(combinedText);

    if (!autoTags || autoTags.length === 0) {
      autoTags = ["bookmark", "web", "saved"];
    }

    // 🔥 CLEAN USER TAGS (IMPORTANT FIX - NOW USED PROPERLY)
    const cleanUserTags = Array.isArray(tags)
      ? tags
          .map((t) => t?.toString().trim())
          .filter((t) => t && t.length > 1 && t !== "#")
      : [];

    // 🔥 FINAL TAG MERGE (BEST LOGIC)
    const finalTags =
      cleanUserTags.length > 0
        ? [...new Set([...cleanUserTags, ...autoTags])]
        : autoTags;

    // 🔥 EMBEDDING
    const embedding = await getEmbedding(combinedText);

    // 🔥 IMAGE SAFE
    const image = extracted.image || "";

    // 🆕 CREATE BOOKMARK
    const bookmark = await bookmarkModel.create({
      user: userId,
      url,

      title: title || extracted.title || url,
      description: extracted.description || "",
      content: finalContent,
      image,
      type,

      tags: finalTags,

      folder: folder || "general",

      isFavorite: favorite || false, // ✅ ADD THIS

      embedding,
    });

    await processItem(bookmark);

    // 📤 RESPONSE
    return res.status(201).json({
      success: true,
      message: "Bookmark created successfully 🎉",
      bookmark,
    });
  } catch (error) {
    console.error("createBookmarkController ERROR:", error.message);
    return next(error);
  }
}

export async function getBookmarksController(req, res, next) {
  try {
    const userId = req.user._id;

    const {
      page = 1,
      limit = 10,
      type,
      tags,
      search,
      favorite,
      folder,
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    let filter = { user: userId };

    if (search?.trim()) {
      const keywords = search.split(" ");

      filter.$or = keywords.flatMap((word) => [
        { title: { $regex: word, $options: "i" } },
        { type: { $regex: word, $options: "i" } },
        { tags: { $regex: word, $options: "i" } },
      ]);
    }

    if (type) {
      filter.type = { $regex: type, $options: "i" };
    }

    if (favorite === "true") {
      filter.isFavorite = true;
    }

    if (tags) {
      const tagsArray = tags.split(","); // "react,node" → ["react","node"]

      filter.tags = { $in: tagsArray };
    }

    if (folder) {
      filter.folder = folder;
    }
    const skip = (pageNum - 1) * limitNum;

    const bookmarks = await bookmarkModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await bookmarkModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      bookmarks,
    });
  } catch (error) {
    next(error);
  }
  // GET /api/bookmarks?search=react&tags=node,frontend&page=1&limit=5
}

export async function getSingleBookmarkController(req, res, next) {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    // 🔎 Find bookmark
    const bookmark = await bookmarkModel.findById(id);

    if (!bookmark) {
      const error = new Error("Bookmark not found");
      error.statusCode = 404;
      return next(error);
    }

    // 🔐 Ownership check
    if (bookmark.user.toString() !== userId.toString()) {
      const error = new Error("Unauthorized access");
      error.statusCode = 403;
      return next(error);
    }

    // 📤 Response
    res.status(200).json({
      success: true,
      bookmark,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateBookmarkController(req, res, next) {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const { title, type, tags, url, folder } = req.body;

    // 🔎 Find bookmark
    const bookmark = await bookmarkModel.findById(id);

    if (!bookmark) {
      const error = new Error("Bookmark not found");
      error.statusCode = 404;
      return next(error);
    }

    // 🔐 Ownership check
    if (bookmark.user.toString() !== userId.toString()) {
      const error = new Error("Unauthorized access");
      error.statusCode = 403;
      return next(error);
    }

    // ✏️ Update fields (only if provided)
    if (title) bookmark.title = title;
    if (type) bookmark.type = type;
    if (tags) bookmark.tags = tags;
    if (url) bookmark.url = url;
    if (folder) bookmark.folder = folder;

    // 💾 Save
    await bookmark.save();

    // 📤 Response
    res.status(200).json({
      success: true,
      message: "Bookmark updated successfully ✏️",
      bookmark,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteBookmarkController(req, res, next) {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    // 🔎 Find bookmark
    const bookmark = await bookmarkModel.findById(id);

    if (!bookmark) {
      const error = new Error("Bookmark not found");
      error.statusCode = 404;
      return next(error);
    }

    // 🔐 Ownership check
    if (bookmark.user.toString() !== userId.toString()) {
      const error = new Error("Unauthorized access");
      error.statusCode = 403;
      return next(error);
    }

    // 🗑️ Delete bookmark
    await bookmark.deleteOne();

    // 📤 Response
    res.status(200).json({
      success: true,
      message: "Bookmark deleted successfully 🗑️",
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleFavoriteController(req, res, next) {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const bookmark = await bookmarkModel.findById(id);

    if (!bookmark) {
      const error = new Error("Bookmark not found");
      error.statusCode = 404;
      return next(error);
    }

    // 🔐 Ownership check
    if (bookmark.user.toString() !== userId.toString()) {
      const error = new Error("Unauthorized");
      error.statusCode = 403;
      return next(error);
    }

    // ⭐ Toggle
    bookmark.isFavorite = !bookmark.isFavorite;

    await bookmark.save();

    res.status(200).json({
      success: true,
      message: bookmark.isFavorite
        ? "Added to favorites ⭐"
        : "Removed from favorites ❌",
      bookmark,
    });
  } catch (error) {
    next(error);
  }
}

export async function renameFolderController(req, res, next) {
  try {
    const userId = req.user._id;
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
      const error = new Error("Both oldName and newName are required");
      error.statusCode = 400;
      return next(error);
    }

    // 🔄 Update all bookmarks of this user
    const result = await bookmarkModel.updateMany(
      { user: userId, folder: oldName },
      { $set: { folder: newName } },
    );

    res.status(200).json({
      success: true,
      message: "Folder renamed successfully 📁",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteFolderController(req, res, next) {
  try {
    const userId = req.user._id;
    const { folderName } = req.body;

    if (!folderName) {
      const error = new Error("Folder name is required");
      error.statusCode = 400;
      return next(error);
    }

    // 🔄 Move bookmarks to default folder
    const result = await bookmarkModel.updateMany(
      { user: userId, folder: folderName },
      { $set: { folder: "general" } },
    );

    res.status(200).json({
      success: true,
      message: "Folder deleted & bookmarks moved to general 📁",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
}

export async function semanticSearchController(req, res, next) {
  try {
    const userId = req.user._id;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    // 🔥 Step 1: Query embedding
    const queryEmbedding = await getEmbedding(query);

    // 🔥 Step 2: DB se bookmarks lao
    const bookmarks = await bookmarkModel.find({ user: userId });

    // 🔥 Step 3: similarity calculate karo
    const results = bookmarks.map((bookmark) => {
      const similarity = cosineSimilarity(
        queryEmbedding,
        bookmark.embedding || [],
      );

      return {
        ...bookmark.toObject(),
        similarity,
      };
    });

    // 🔥 Step 4: sort karo (highest similarity first)
    results.sort((a, b) => b.similarity - a.similarity);

    // 🔥 Step 5: top results return karo
    res.status(200).json({
      success: true,
      results: results.slice(0, 10),
    });
  } catch (error) {
    next(error);
  }
}

export async function relatedBookmarksController(req, res, next) {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const current = await bookmarkModel.findById(id);

    if (!current) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    // 🔥 baaki bookmarks lao
    const bookmarks = await bookmarkModel.find({
      user: userId,
      _id: { $ne: id },
    });

    const results = bookmarks.map((b) => {
      const similarity = cosineSimilarity(current.embedding, b.embedding || []);

      return {
        ...b.toObject(),
        similarity,
      };
    });

    // sort
    results.sort((a, b) => b.similarity - a.similarity);

    res.status(200).json({
      success: true,
      results: results.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
}

export const moveBookmarkFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { folder } = req.body;

    console.log("ID:", id);
    console.log("FOLDER:", folder);

    const updated = await bookmarkModel.findOneAndUpdate(
      { _id: id },
      { $set: { folder } },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found",
      });
    }

    console.log("UPDATED DOC:", updated);

    res.json({
      success: true,
      message: "Bookmark moved successfully",
      bookmark: updated,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getGraphController = async (req, res) => {
  try {
    const userId = req.user._id;

    const nodes = await bookmarkModel
      .find({ user: userId }, { title: 1, image: 1 })
      .lean();

    const bookmarkIds = nodes.map((n) => n._id);

    const edges = await edgeModel
      .find({
        user: userId,
        from: { $in: bookmarkIds },
        to: { $in: bookmarkIds },
      })
      .lean();

    return res.json({
      success: true,

      nodes: nodes.map((n) => ({
        id: n._id.toString(),
        title: n.title || "Untitled",
        image: n.image?.trim() ? n.image : "https://via.placeholder.com/40",
      })),

      edges: edges.map((e) => ({
        source: e.from.toString(),
        target: e.to.toString(),
        weight: e.weight,
        type: e.type,
      })),
    });
  } catch (err) {
    console.error("Graph API error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to load graph",
    });
  }
};
