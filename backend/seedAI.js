import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

const seedAI = async () => {
  await mongoose.connect(process.env.MONGO_URL); // check your .env file for the correct variable name

  const existing = await User.findOne({ isAI: true });
  if (existing) {
    console.log("AI user already exists:", existing._id);
    process.exit(0);
  }

  const aiUser = await User.create({
    userName: "NovaChat AI",
    password: "unused_ai_password_placeholder",
    isAI: true,
  });

  console.log("AI user created:", aiUser._id);
  process.exit(0);
};

seedAI();