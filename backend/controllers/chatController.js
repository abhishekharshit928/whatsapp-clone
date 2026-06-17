import Chat from "../models/chat.js";
import Message from "../models/message.js";
import User from "../models/user.js";


export const fetchChats = async (req , res , next) => {

  try {
    const userId = req.userId;

    const aiUser = await User.findOne({ isAI: true });
    if (aiUser) {
    
      let aiChat = await Chat.findOne({
        participants: { $all: [userId, aiUser._id] }
      });

      if (!aiChat) {
        aiChat = await Chat.create({
          participants: [userId, aiUser._id]
        });
    

      }
    }
    const chats = await Chat.find({
      participants: userId
    })
      .populate("lastMessage")
      .populate({
        path: "participants",
        select: "-password"   
      })
      .sort({ updatedAt: -1 });

    return res.status(200).json(chats);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error in fetching chats" });
  }
};


export const findChat = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { anotherUserId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User id not found" });
    }
    if (!anotherUserId) {
      return res.status(400).json({ message: "Another user id not found" });
    }

    const chat = await Chat.findOne({
      participants: { $all: [userId, anotherUserId] }
    })
      .populate({ path: "participants", select: "-password" })
      .populate("lastMessage")

    if (chat) {
      return res.status(200).json(chat);
    }

    const newChat = await Chat.create({
      participants: [userId, anotherUserId]
    });

    const createdChat = await Chat.findById(newChat._id)  
      .populate({ path: "participants", select: "-password" })
      .populate("lastMessage")

    return res.status(200).json(createdChat);

  } catch (error) {
    return res.status(500).json({ message: "server error in creating/fetching chat" });
  }
};

