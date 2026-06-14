import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routers/authRouter.js";

dotenv.config();

const app = express();

const DB_path = process.env.MONGO_URL;

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend Connected Successfully"
  });
});


// Routes
app.use("/api/auth", authRouter);

app.get("/" , (req , res , next) =>{
  res.send("hello from server");
})

const PORT = process.env.PORT || 3000;


// DB connection + server start
mongoose.connect(DB_path)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.log("Error connecting to MongoDB:", err);
  });