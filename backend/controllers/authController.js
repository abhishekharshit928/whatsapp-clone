import Chat from "../models/chat.js";
import Message from "../models/message.js";
import User from "../models/user.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {generateRefreshToken , generateAccessToken} from "../config/token.js"

export const signup = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // validation
    if (!userName || userName.trim().length < 3) {
      return res.status(400).json({
        message: "username must be at least 3 characters"
      });
    }

    if (!password || password.length < 5) {
      return res.status(400).json({
        message: "Password must be at least 5 characters"
      });
    }

    // check existing user
    const existingUser = await User.findOne({ userName });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 14);

    // create user
    const newUser = await User.create({
      userName,
      password: hashedPassword
    });

    // AI chat setup
    const aiUser = await User.findOne({ isAI: true });

    if (aiUser) {
      const chat = await Chat.create({
        participants: [newUser._id, aiUser._id]
      });

      const welcomeMessage = await Message.create({
        senderId: aiUser._id,
        chatId: chat._id,
        text: "Hello! I'm NovaChat AI 🤖. Ask me anything.."
      });

      chat.lastMessage = welcomeMessage._id;
      await chat.save();
    }

    // generate refresh token
    const refreshToken = generateRefreshToken(newUser._id);

    // set cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        userName: newUser.userName,
        _id: newUser._id
      }
    });

  } catch (error) {
    console.log("Signup error:", error.message);
    return res.status(500).json({
      message: "server error in signup",
      error: error.message
    });
  }
};


export const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName })
    if (!user) {
      return res.status(400).json({ message: "User name not found" })
    }
    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" })
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000
    })

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        userName: user.userName,
        _id: user._id
      },
      accessToken
    })
  } catch (error) {
    return res.status(500).json({ message: "server error in login" })
  }
}

export const logout = async (req, res, next) => {
  try {
    const userId = req.userId;

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000
    })
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({ message: "Logged out", success: true })

  } catch (error) {
    return res.status(500).json({ message: "server error in logout" })
  }
}


export const RefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token found" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newAccessToken = generateAccessToken(userId);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
      accessToken: newAccessToken,
      user: {
        userName: user.userName,
        _id: user._id
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error in refresh token"
    });
  }
};