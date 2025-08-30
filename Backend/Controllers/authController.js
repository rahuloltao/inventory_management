// import jwt from "jsonwebtoken";
// import User from "../Models/userModel.js";
// import bcrypt from "bcrypt";

// export const registerController = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ status: false, message: "User already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const newUser = new User({ email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ status: true, message: "User registered successfully" });
//   } catch (error) {
//     console.error("Register error:", error);
//     res.status(500).json({ status: false, message: "Server error" });
//   }
// };

// export const loginController = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ status: false, message: "Invalid email or password" });
//     }

//     // Compare the passwords
//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return res.status(404).json({ status: false, message: "Invalid email or password" });
//     }

//     // Generate a JWT token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

//     // Set the token as a cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 1000 * 60 * 60, // 1 hour
//     });

//     res.status(200).json({ status: true, message: "Login successful" });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ status: false, message: "Server error" });
//   }
// };

// export const logoutController = (req, res) => {
//   res.clearCookie("token");
//   res.status(200).json({ status: true, message: "Logged out successfully" });
// };

// export const getUserController = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select("-password");
//     if (!user) {
//       return res.status(404).json({ status: false, message: "Unauthorized user" });
//     }

//     res.status(200).json({ status: true, data: user });
//   } catch (error) {
//     console.error("GetUser error:", error);
//     res.status(500).json({ status: false, message: "Server error" });
//   }
// };

import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import bcrypt from "bcrypt";

/**
 * Register Controller
 */
export const registerController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ status: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      status: true,
      message: "User registered successfully",
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
  }
};

/**
 * Login Controller
 */
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid email or password" });
    }

    // Compare the passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    res.status(200).json({ status: true, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
  }
};

/**
 * Logout Controller
 */
export const logoutController = (req, res) => {
  res.clearCookie("token");
  res
    .status(200)
    .json({ status: true, message: "Logged out successfully" });
};

/**
 * Get User Controller
 */
export const getUserController = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Unauthorized user" });
    }

    res.status(200).json({ status: true, data: user });
  } catch (error) {
    console.error("GetUser error:", error);
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
  }
};
