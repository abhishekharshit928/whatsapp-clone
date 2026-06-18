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

dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const DB_path = process.env.MONGO_URL;

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Socket Connection
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
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