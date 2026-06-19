import { createSlice } from "@reduxjs/toolkit";

const onlineSlice = createSlice({
name: "online",
initialState:{
    users: []
},
reducers:{
    setOnlineUsers:(state,action)=>{
        state.users = action.payload
    },
  addOnlineUser:(state,action)=>{
 if(!state.users.includes(action.payload)){
    state.users.push(action.payload);
 }   
  },
  removeOnlineuser:(state,action)=>{
state.users = state.users.filter(
    id => id !== action.payload
)
  }

}
})
export const {setOnlineUsers, addOnlineUser, removeOnlineuser} = onlineSlice.actions
export default onlineSlice.reducer