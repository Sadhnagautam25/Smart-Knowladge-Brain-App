import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import redis from "../config/cache.js";

export async function IdentifyUser(req, res, next) {
  try {
    // 🍪 1. Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      const error = new Error("Unauthorized: No token provided");
      error.statusCode = 401;
      throw error;
    }

    // 🚫 2. Check if token is blacklisted (Redis)
    const isBlacklisted = await redis.get(token);

    if (isBlacklisted) {
      const error = new Error("Unauthorized: Token is blacklisted");
      error.statusCode = 401;
      throw error;
    }

    // 🔐 3. Verify & decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👤 4. Find user
    const user = await userModel.findById(decoded.id);

    if (!user) {
      const error = new Error("Unauthorized: User not found");
      error.statusCode = 401;
      throw error;
    }

    // 📦 5. Attach user to request
    req.user = user;

    // 👉 Move to next middleware
    next();
  } catch (error) {
    next(error);
  }
}
