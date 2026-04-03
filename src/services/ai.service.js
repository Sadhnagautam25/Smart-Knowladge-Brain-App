import bookmarkModel from "../models/bookmark.model.js"

export const vectorSearch = async (queryEmbedding) => {
  const results = await bookmarkModel.aggregate([
    {
      $vectorSearch: {
        index: "bookmark_vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit: 5
      }
    },
    {
      $project: {
        content: 1,
        title: 1,
        description: 1,
        score: { $meta: "vectorSearchScore" }
      }
    }
  ]);

  return results;
};

export default vectorSearch;