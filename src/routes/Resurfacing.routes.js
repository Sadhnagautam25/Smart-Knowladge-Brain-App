import express from "express";
import { IdentifyUser } from "../middlewares/auth.middleware.js";
import {
  getTodayResurfaced,
  resurfacedBookmarksController,
} from "../controllers/Resurfacing.controller.js";

const resurfaceRouter = express.Router();

resurfaceRouter.get("/resurface", IdentifyUser, resurfacedBookmarksController);
resurfaceRouter.get("/resurface/today", IdentifyUser, getTodayResurfaced);

export default resurfaceRouter;  
 