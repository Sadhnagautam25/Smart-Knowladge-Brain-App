import express from "express";
import { IdentifyUser } from "../middlewares/auth.middleware.js";
import { chatWithAI } from "../controllers/ai.controller.js";
const aiRouter = express.Router();

// aiRouter prifix is => /api/ai

aiRouter.post("/chat", IdentifyUser, chatWithAI);

export default aiRouter;
