import bookmarkModel from "../models/bookmark.model.js";
import Resurfaced from "../models/resurfaced.model.js";

// ✅ CLEAN MIXED RESURFACED (NO DUPLICATES, STABLE OUTPUT)
export async function resurfacedBookmarksController(req, res, next) {
  try {
    const userId = req.user._id;

    const days = Number(req.query.days) || 60;
    const limit = Number(req.query.limit) || 10;

    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - days);

    // 🔥 OLD bookmarks
    const oldBookmarks = await bookmarkModel.find({
      user: userId,
      createdAt: { $lte: oldDate },
    });

    // 🔥 RECENT bookmarks
    const recentBookmarks = await bookmarkModel.find({
      user: userId,
      createdAt: { $gt: oldDate },
    });

    // 🔥 MERGE FIRST
    const merged = [...oldBookmarks, ...recentBookmarks];

    // 🧹 REMOVE DUPLICATES (IMPORTANT FIX)
    const uniqueMap = new Map();
    merged.forEach((item) => {
      uniqueMap.set(item._id.toString(), item);
    });

    const uniqueData = Array.from(uniqueMap.values());

    // 🎲 SAFE SHUFFLE
    const shuffled = uniqueData.sort(() => Math.random() - 0.5);

    // ✂️ LIMIT OUTPUT
    const selected = shuffled.slice(0, limit);

    res.status(200).json({
      success: true,
      count: selected.length,
      bookmarks: selected,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTodayResurfaced(req, res, next) {
  try {
    const userId = req.user._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const bookmarks = await bookmarkModel.find({
      user: userId,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      bookmarks,
    });
  } catch (error) {
    next(error);
  }
}
