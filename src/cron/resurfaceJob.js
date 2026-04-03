import cron from "node-cron";
import bookmarkModel from "../models/bookmark.model.js";
import Resurfaced from "../models/resurfaced.model.js";

export function startResurfaceJob() {
  cron.schedule("* * * * *", async () => {
    console.log("⏰ Running resurfacing job...");

    const users = await bookmarkModel.distinct("user");

    for (const userId of users) {
      const days = 60;

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

      const shuffledOld = oldBookmarks.sort(() => Math.random() - 0.5);
      const shuffledRecent = recentBookmarks.sort(() => Math.random() - 0.5);

      let selected = shuffledOld.slice(0, 5);

      if (selected.length < 5) {
        const remaining = 5 - selected.length;
        selected = selected.concat(shuffledRecent.slice(0, remaining));
      }

      // ✅ FIXED: remove date filter (IMPORTANT)
      await Resurfaced.findOneAndUpdate(
        {
          user: userId,   // 👈 ONLY USER BASED (no date)
        },
        {
          user: userId,
          bookmarks: selected.map((b) => b._id),
          date: new Date(), // optional (sirf info ke liye)
        },
        {
          upsert: true,
          new: true,
        }
      );

      console.log(`✅ Resurfaced saved for user ${userId}`);
    }
  });
}