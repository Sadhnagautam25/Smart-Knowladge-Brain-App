import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

export async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Server connected to DB successfully 🎉");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1); // exit if DB fails
  }
}

export default connectToDB;
