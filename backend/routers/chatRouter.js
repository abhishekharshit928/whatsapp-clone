import express from "express";
import protect from "../middlewares/protect.js";
import { fetchChats, findChat } from "../controllers/chatController.js";
const chatRouter = express.Router();

chatRouter.get("/fetchchats" , protect , fetchChats);
chatRouter.post("/findchat" , protect , findChat);


export default chatRouter;
