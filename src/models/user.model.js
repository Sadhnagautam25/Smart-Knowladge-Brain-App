import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // 🔥 important (hide password by default)
    },

    bio: {
      type: String,
      default: "",
      maxlength: [200, "Bio cannot exceed 200 characters"],
    },

    profile: {
      type: String,
      default: "https://ik.imagekit.io/habrddp30/default%20image.avif",
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  },
);

// 🔐 Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// 🔑 Compare password method (login)
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const userModel = mongoose.model("User", userSchema);

export default userModel;
