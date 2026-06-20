import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routers/authRouter.js";
import chatRouter from "./routers/chatRouter.js";
import aiRouter from "./routers/aiRouter.js"
import messageRouter from "./routers/messageRouter.js"
import userRouter from "./routers/userRouter.js";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import User from "./models/user.js";  
import Message from "./models/message.js";

dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://whatsapp-clone-eight-orpin.vercel.app",
    credentials: true,
  },
});

app.set("io", io); 

const DB_path = process.env.MONGO_URL;

// Middlewares
const allowedOrigins = [
    "http://localhost:5173",
    "https://whatsapp-clone-eight-orpin.vercel.app"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials:true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Socket Connection
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join", async (userId) => {
    if (!userId) return;
    socket.userId = userId;

    try {
      await User.findByIdAndUpdate(userId, {
        socketId: socket.id,
        isOnline: true,
      });
      socket.broadcast.emit("userOnline", userId);
    } catch (err) {
      console.log("Error setting socketId on join:", err.message);
    }
  });
  socket.on("seenMessages", async ({ chatId }) => {
  if (!chatId || !socket.userId) return;

  try {
    const result = await Message.updateMany(
      { chatId, senderId: { $ne: socket.userId }, seen: false },
      { $set: { seen: true } }
    );

    if (result.modifiedCount > 0) {
      io.emit("messagesSeen", { chatId, seenBy: socket.userId });
    }
  } catch (err) {
    console.log("Error marking messages as seen:", err.message);
  }
});


  socket.on("disconnect", async () => {
    console.log("User Disconnected:", socket.id);
    if (!socket.userId) return;

    try {
      await User.findByIdAndUpdate(socket.userId, {
        socketId: null,
        isOnline: false,
      });
      socket.broadcast.emit("userOffline", socket.userId);
    } catch (err) {
      console.log("Error clearing socketId on disconnect:", err.message);
    }
  });
});


// Routes
app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);
app.use("/api/ai", aiRouter)
app.use("/api/messages", messageRouter);
app.use("/api/user", userRouter);


const PORT = process.env.PORT || 3000;

mongoose.connect(DB_path)
  .then(() => {
    console.log("Connected to MongoDB");

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });