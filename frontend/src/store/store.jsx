import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import chatListReducer from "./chatListSlice";
import chatReducer from "./chatSlice";
import uiReducer from "./uiSlice";
import selectedMessageReducer from "./selectMessageSlice";
import onlineReducer from "./onlineSlice";
import resultsReducer from "./resultSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chatList: chatListReducer,
    chat:chatReducer,
    ui:uiReducer,
    selectedMessage:selectedMessageReducer,
    onlineUsers:onlineReducer,
    results:resultsReducer
  },
});