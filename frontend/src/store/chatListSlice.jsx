import { createSlice } from "@reduxjs/toolkit";

const chatListSlice = createSlice({
    name: "chatList",
    initialState: {
        chatList: []
    },
    reducers: {
        setChats(state, action) {
            state.chatList = action.payload;
        },

        updateChat(state, action) {
            const { message, selectedChatId, userId } = action.payload;

            const chatIndex = state.chatList.findIndex(
                c => c._id === message.chatId
            );

            if (chatIndex !== -1) {

                const chat = state.chatList[chatIndex];

                const isOwnMessage =
                    message.senderId?.toString() === userId?.toString();

                const isChatOpen =
                    selectedChatId === message.chatId;

                const updatedChat = {
                    ...chat,
                    lastMessage: {
                        text: message.text,
                        senderId: message.senderId,
                        createdAt: message.createdAt
                    },
                    updatedAt: message.createdAt,
                    unreadCount: isOwnMessage
                        ? chat.unreadCount
                        : (isChatOpen ? 0 : (chat.unreadCount || 0) + 1)
                };

                state.chatList.splice(chatIndex, 1);
                state.chatList.unshift(updatedChat);
            }
        },
        clearUnread(state, action) {
            const chatId = action.payload;

            const chat = state.chatList.find(c => c._id === chatId);

            if (chat) {
                chat.unreadCount = 0;
            }
        }
    }
});

export const { setChats, updateChat ,clearUnread} = chatListSlice.actions;
export default chatListSlice.reducer;