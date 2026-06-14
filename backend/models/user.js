import mongoose  from "mongoose";

const userSchema = mongoose.Schema({

userName:{
type:String,
required: true,
unique: true,
minlength:[3]
},
password:{
type:String, 
required:true,
minlength:[5]
}, 
isAI: {
    type: Boolean,
    default: false
  }
},{timestamps:true})
const User = mongoose.model("User", userSchema)

export default User