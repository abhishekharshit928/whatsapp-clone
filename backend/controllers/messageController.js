import Chat from "../models/chat.js";
import Message from "../models/message.js"
import User from "../models/user.js";
import {askGemini} from "../services/gemini.js"
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();


export const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.userId;
    const io = req.app.get("io");

    const { receiver, text } = req.body;

    if (senderId === receiver) {
      return res.status(400).json({ error: "You cannot send message to yourself" });
    }

    if (!receiver || !text) {
      return res.status(400).json({ error: "missing receiver or text" });
    }

    const receiverUser = await User.findById(receiver);

    if (!receiverUser) {
      return res.status(400).json({ error: "receiver not found" });
    }

    // AI CHAT 
    if (receiverUser.isAI) {

      let chat = await Chat.findOne({
        participants: { $all: [senderId, receiver] }
      });

      if (!chat) {
        chat = await Chat.create({
          participants: [senderId, receiver]
        });
      }

      const userMessage = await Message.create({
        chatId: chat._id,
        senderId,
        text,
        media: []
      });

      chat.lastMessage = userMessage._id;
      await chat.save();

      const senderSocketId = req.user?.socketId;

      if (senderSocketId) {
        io.to(senderSocketId).emit("newMessage", userMessage);

        io.to(senderSocketId).emit("AiTyping", {
          chatId: chat._id,
          status: true
        });
      }

      const result = await askGemini(text);
      const aiReply = result.response.text();

      if (senderSocketId) {
        io.to(senderSocketId).emit("AiTyping", {
          chatId: chat._id,
          status: false
        });
      }

      const aiMessage = await Message.create({
        chatId: chat._id,
        senderId: receiver,
        text: aiReply,
        media: []
      });

      chat.lastMessage = aiMessage._id;
      await chat.save();

      if (senderSocketId) {
        io.to(senderSocketId).emit("newMessage", aiMessage);
      }

      return res.status(201).json(aiMessage);
    }

    // NORMAL CHAT

    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiver] }
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiver]
      });
    }

    const message = await Message.create({
      chatId: chat._id,
      senderId,
      text,
      media: []
    });

    chat.lastMessage = message._id;
    await chat.save();

    const sender = await User.findById(senderId);

    const senderSocketId = sender?.socketId;
    const receiverSocketId = receiverUser?.socketId;

    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", message);
    }

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    return res.status(201).json(message);

  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    res.status(500).json({ message: "server error in sending message" });
  }
};


export const fetchMessages = async (req, res) => {
  try {

    const chatId = req.params.chatId;

    const messages = await Message.find({
      chatId,
      deletedFor: { $ne: req.userId }
    })


    return res.status(200).json(messages);

  } catch (error) {

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMedia = async (req, res) => {
  try{
    const io = app.get("io");
    const senderId = req.userId;
    const { receiver} = req.body;
    const media = req.files || [];

    const mediaFiles = media.map((file) => ({
      url:file.path,
       type: file.mimetype.startsWith("video/") ? "video" : "image"    
      }));

      if (senderId === receiver) {
      return res.status(400).json({ error: "You cannot send message to yourself" });

      if(!receiver || mediaFiles.length===0){
        return res.status(400).json({error: "missing receiver or media files"});
      }
    }
        let chat = await Chat.findOne({
      participants: { $all: [senderId, receiver] }
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiver]
      })
    }


    const message = await Message.create({
      chatId: chat._id,
      senderId,
      text: "",
      media: mediaFiles
    });


    chat.lastMessage = message._id;
    await chat.save();

    const sender = await User.findById(senderId);

    const senderSocketId = sender?.socketId;
    const receiverSocketId = receiverUser?.socketId;

    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", message);
    }

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    return res.status(201).json(message);

  }catch(error){
    console.error(error)
    res.status(500).json({ message: "server errror in sending message "});
  }
}

export const deleteMessageForMe = async (req, res, next) => {
  try {
    const io = req.app.get("io");
    const userId = req.userId;
    const { selectedMessage } = req.body;

    const message = await Message.findById(selectedMessage);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await Message.findByIdAndUpdate(
      selectedMessage,
      {
        $addToSet: {
          deletedFor: userId
        }
      }
    );

    const user = await User.findById(userId);

    if (user?.socketId) {
      io.to(user.socketId).emit("deletedMessage", selectedMessage);
    }

    return res.status(200).json({
      message: "Message deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error in deleting message"
    });
  }
};



export const deleteForEveryOne = async (req, res, next) => {
  try {
    const io = req.app.get("io");

    const userId = req.userId;
    const { selectedMessages } = req.body;


    if(!selectedMessages.length){
      return res.status(400).json({
        message:"No messages selected"
      });
    }


    const isAllMessageMine = selectedMessages.every(
      (msg) => msg.senderId.toString() === userId.toString()
    );


    if(!isAllMessageMine){
      return res.status(403).json({
        message:"You can only delete your own messages"
      });
    }


    const messageIds = selectedMessages.map(
      (msg)=> msg._id
    );


    await Message.updateMany(
      {
        _id:{
          $in:messageIds
        }
      },
      {
        $set:{
          isDeleted:true
        }
      }
    );


    const chatId = selectedMessages[0].chatId;


    const chat = await Chat.findById(chatId);

    if(!chat){
      return res.status(404).json({
        message:"Chat not found"
      });
    }


    const otherUserId = chat.participants.find(
      (id)=>id.toString() !== userId.toString()
    );


    const sender = await User.findById(userId);
    const receiverUser = await User.findById(otherUserId);


    if(sender?.socketId){
      io.to(sender.socketId)
      .emit(
        "deletedMessagesForEveryone",
        selectedMessages
      );
    }


    if(receiverUser?.socketId){
      io.to(receiverUser.socketId)
      .emit(
        "deletedMessagesForEveryone",
        selectedMessages
      );
    }


    res.json({
      success:true
    });


  }catch(error){

    res.status(500).json({
      message:"Server error in deleting messages"
    });

  }
}

export const deleteAllMessageforme = async (req, res, next) => {
  try{  
  const io = req.app.get("io");

  const userId = req.userId;
  const { chatId } = req.body;

  await Message.updateMany(
    { chatId },
    {
      $addToSet: {
        deletedFor: userId
      }
    }
  );
  const user = await User.findById(userId);
  if(user?.socketId){
  io.to(user.socketId)
  .emit("chatCleared", chatId);
}
  res.json({
    success: true
  })
}catch(error){
  res.status(500).json({
    message: "Server error in deleting messages"
  });
}
}
