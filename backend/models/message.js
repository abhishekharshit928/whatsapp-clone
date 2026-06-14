import mongoose from "mongoose";

const messageSchema = mongoose.Schema({

    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },


    senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },


  text: {
    type: String,
    default:""
  },
  seen:{
    type: Boolean,
    default: false,
  },

media: [{
  url: String,
  filetype: String
}],
deletedFor:[
  {
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
],
isDeleted: {
  type: Boolean,
  default: false
}


}, { timestamps: true })

messageSchema.index({text :"text"});


const Message = mongoose.model("Message", messageSchema)

export default Message