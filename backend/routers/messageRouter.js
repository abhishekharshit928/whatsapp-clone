import express from "express"
import protect from "../middlewares/protect.js";
import {  deleteAllMessageforme, deleteForEveryOne, deleteMessageForMe, fetchMessages, sendMedia, sendMessage } from "../controllers/messageController.js";
import upload from "../config/multer.js";
const messageRouter = express.Router();
messageRouter.post("/send",protect,sendMessage)
messageRouter.post("/send-media",protect,upload.array("media",5),sendMedia)
messageRouter.get("/fetchmessage/:chatId",protect,fetchMessages)
messageRouter.delete("/deleteforme",protect,deleteMessageForMe)
messageRouter.delete("/deleteforeveryone",protect,deleteForEveryOne)
messageRouter.delete("/deleteallforme",protect,deleteAllMessageforme)

export default messageRouter