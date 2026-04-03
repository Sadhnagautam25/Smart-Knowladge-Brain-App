import bookmarkModel from "../models/bookmark.model.js";
import edgeModel from "../models/Edge.model.js";

function cosineSimilarity(a, b) {
  let dot = 0,
    magA = 0,
    magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export const processItem = async (item) => {
  try {
    const embedding = Array.isArray(item.embedding)
      ? item.embedding
      : [];

    if (!embedding.length) {
      console.log("❌ No embedding found");
      return;
    }

    const allItems = await bookmarkModel.find({
      user: item.user,
      _id: { $ne: item._id },
    });

    for (let other of allItems) {
      if (!Array.isArray(other.embedding)) continue;

      const score = cosineSimilarity(embedding, other.embedding);

      if (score > 0.78) {
        // prevent duplicate edges (both directions)
        const exists = await edgeModel.findOne({
          $or: [
            { from: item._id, to: other._id },
            { from: other._id, to: item._id },
          ],
        });

        if (exists) continue;

        await edgeModel.create({
          user: item.user,
          from: item._id,
          to: other._id,
          weight: score,
          type: "semantic",
        });

        console.log("✅ EDGE CREATED", score);
      }
    }
  } catch (err) {
    console.log("❌ processItem error:", err);
  }
};
