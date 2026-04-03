import express from "express";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator.js";
import {
  getMeController,
  loginController,
  logoutController,
  profileUpdateController,
  registerController,
} from "../controllers/auth.controller.js";
import { uploadProfileImage } from "../middlewares/upload.middleware.js";
import { IdentifyUser } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();
// authRouter prifix => /api/auth

// create register api 1️⃣
// api name => /api/auth/register
// api method => POST
// status code => 201

authRouter.post(
  "/register",
  uploadProfileImage,
  registerValidator,
  registerController,
);

// create login api 2️⃣
// api name => /api/auth/login
// api method => POST
// status code => 200

authRouter.post("/login", loginValidator, loginController);

// create getMe api 3️⃣
// api name => /api/auth/get-me
// api method => GET
// status code => 200

authRouter.get("/get-me", IdentifyUser, getMeController);

// create update profile api 4️⃣
// api name => /api/auth/update-profile
// api method => PUT
// status code => 200

authRouter.put(
  "/update-profile",
  IdentifyUser,
  uploadProfileImage,
  profileUpdateController,
);

// create Logout api 4️⃣
// api name => /api/auth/logout
// api method => GET
// status code => 200

authRouter.get("/logout", logoutController)

export default authRouter;
