// seedUser.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./Models/userModel.js"; // adjust path if needed
import { DB_NAME } from "./constants.js";

dotenv.config();

const MONGO_URI = `${process.env.MONGODB_URI}/${DB_NAME}`;

const createUser = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = "rahuloltao@gmail.com";
    const password = "@Jainrahul1234";

    // check if already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("⚠️ User already exists:", email);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    console.log("🎉 User created successfully:", user);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating user:", err);
    process.exit(1);
  }
};

createUser();