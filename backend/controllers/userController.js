import User from "../models/user.js";

export const fetchUser = async (req , res , next) => {
  try {
    const userId = req.userId;
     const foundUser = await User
      .findById(userId)
      .select("-password");

      if(!foundUser){
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(foundUser);
  } catch (error) {
    res.status(500).json({ message: "Server error in fetching user" });
  }
}

export const fetchAllUser = async (req ,res , next) => {
  try {
    const users = await User.find({_id:{$ne: req.userId}}).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error in fetching users" });
  }
}

export const fetchOnlineUser = async (req , res , next) =>{
  try {
     const users = await User.find({
    socketId: { $ne: null },
   _id:{
     $ne:req.userId
   }
 }).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error in fetching online users" });
  }
}