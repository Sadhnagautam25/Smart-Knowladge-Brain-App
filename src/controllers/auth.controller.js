import { genrateToken } from "../utils/genrateToken.js";
import { userModel } from "../models/user.model.js";
import { redis } from "../config/cache.js";
import uploadFile from "../services/ImgStorage.service.js";

export async function registerController(req, res, next) {
  try {
    const { username, email, password, bio } = req.body;

    // 🔍 Check if email already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      const error = new Error("Email already exists");
      error.statusCode = 400;
      return next(error);
    }

    // 🖼️ Handle profile image (buffer)
    let profileUrl = "";

    if (req.file) {
      const uploaded = await uploadFile({
        buffer: req.file.buffer, // 👈 correct key
        fileName: "profile",
        folder: "/SmartKnowladeApp/userProfiles",
      });

      profileUrl = uploaded.url;
    }

    // 👤 Create user
    const user = await userModel.create({
      username,
      email,
      password,
      bio,
      profile: profileUrl || undefined,
    });

    // 🔑 Generate token
    const token = genrateToken(user);

    // 🍪 Set cookie
    res.cookie("token", token);

    // 📤 Response
    res.status(201).json({
      success: true,
      message: "User registered successfully 🎉",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profile: user.profile,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;

    // 🔍 Check user exists + get password
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      return next(error);
    }

    // 🔐 Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      return next(error);
    }

    // 🔑 Generate token
    const token = genrateToken(user);

    // 🍪 Set cookie
    res.cookie("token", token);

    // 📤 Response
    res.status(200).json({
      success: true,
      message: "Login successful 🎉",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profile: user.profile,
      },
      token
    });
  } catch (error) {
    next(error);
  }
}

export async function getMeController(req, res, next) {
  try {
    const user = req.user;

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // 📤 Response
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profile: user.profile,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function profileUpdateController(req, res, next) {
  try {
    const userId = req.user._id; // 👈 from IdentifyUser middleware
    const { username, bio } = req.body;

    // 👤 Find user
    const user = await userModel.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // ✏️ Update allowed fields only
    if (username) user.username = username;
    if (bio) user.bio = bio;

    // 🖼️ Handle profile image update
    if (req.file) {
      const uploaded = await uploadFile({
        buffer: req.file.buffer,
        fileName: "profile",
        folder: "/SmartKnowladeApp/userProfiles",
      });

      user.profile = uploaded.url;
    }

    // 💾 Save updated user
    await user.save();

    // 📤 Response
    res.status(200).json({
      success: true,
      message: "Profile updated successfully 🎉",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email, // read-only
        bio: user.bio,
        profile: user.profile,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutController(req, res, next) {
  try {
    // 🍪 Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      const error = new Error("No token found");
      error.statusCode = 400;
      return next(error);
    }

    // ⏳ Set token in Redis blacklist (expire after 7 days)
    await redis.set(token, "blacklisted", "EX", 7 * 24 * 60 * 60);

    // 🍪 Clear cookie
    res.clearCookie("token");

    // 📤 Response
    res.status(200).json({
      success: true,
      message: "Logged out successfully 🚀",
    });

  } catch (error) {
    next(error);
  }
}
