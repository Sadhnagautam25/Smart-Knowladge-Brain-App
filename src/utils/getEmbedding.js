import dotenv from "dotenv";
dotenv.config();
import { Mistral } from "@mistralai/mistralai";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function getEmbedding(text) {
  try {
    const res = await client.embeddings.create({
      model: "mistral-embed",
      inputs: [text],
    });

    return res.data[0].embedding;
  } catch (err) {
    console.log("Mistral error:", err.message);
    return [];
  }
}