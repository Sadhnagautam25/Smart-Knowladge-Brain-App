import chatModel from "../models/chat.model.js";
import { vectorSearch } from "../services/ai.service.js";
import { getEmbedding } from "../utils/getEmbedding.js";
import { model } from "../utils/groq.js";
import bookmarkModel from "../models/bookmark.model.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    // 1. get or create chat
    let chat = await chatModel.findOne({ user: userId });

    if (!chat) {
      chat = await chatModel.create({
        user: userId,
        messages: [],
      });
    }

    // 2. get previous messages (last 6)
    const previousMessages = chat.messages.slice(-6);

    const history = previousMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // 🔥 3. TOTAL COUNT (IMPORTANT FIX)
    const totalBookmarks = await bookmarkModel.countDocuments({
      user: userId,
    });

    // 4. embedding
    const queryEmbedding = await getEmbedding(message);

    // 5. vector search (top relevant only)
    const results = await vectorSearch(queryEmbedding);

    // 6. context build
    const context = results.length
      ? results
          .map((r, i) => `${i + 1}. ${r.title || ""} - ${r.description || ""}`)
          .join("\n")
      : "No relevant bookmarks found.";

    // 7. LLM call (Groq)
    const completion = await model.invoke([
      {
        role: "system",
        content: `
You are a helpful AI assistant.

Rules:
- Always answer based on user's bookmarks data.
- Total bookmarks count is ${totalBookmarks}.
- Use context for relevant answers.
- If user asks "how many bookmarks", ALWAYS use the total count.
        `,
      },
      ...history,
      {
        role: "user",
        content: `
Total Bookmarks: ${totalBookmarks}

Context:
${context}

Question:
${message}
        `,
      },
    ]);

    const reply = completion.content;

    // 8. save messages
    chat.messages.push({ role: "user", content: message });
    chat.messages.push({ role: "assistant", content: reply });

    await chat.save();

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
