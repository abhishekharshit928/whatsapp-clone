import { useEffect, useState } from "react";
import api from "../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../store/chatSlice";
import socket from "../../socket/socket";
import { setChats, updateChat, clearUnread } from "../store/chatListSlice.jsx";

const Chats = () => {
  const chats = useSelector((state) => state.chatList.chatList);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const onlineUsers = useSelector((state) => state.onlineUsers.users);
  const selectedChat = useSelector((state) => state.chat.selectedChat);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/chats/fetchchats");
      const chatsWithUnread = res.data.map((chat) => ({
        ...chat,
        unreadCount: 0,
      }));

      dispatch(setChats(chatsWithUnread));
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    fetchChats();
  }, [user?._id]);

  useEffect(() => {
    const updateNewChats = (message) => {
      dispatch(
        updateChat({
          message,
          selectedChatId: selectedChat?._id,
          userId: user?._id,
        })
      );
    };

    socket.on("newMessage", updateNewChats);

    return () => socket.off("newMessage", updateNewChats);
  }, [selectedChat, user]);

  if (!user?._id) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <span className="text-gray-400">Loading chats...</span>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center h-[80vh]">
          <span className="text-gray-400">Loading..</span>
        </div>
      )}

      {!loading && (
        <div className="max-w-2xl mx-auto space-y-3 h-screen overflow-y-auto ultra-thin-scroll pr-1">
          {chats.map((chat) => {
            const otherUser = chat.participants?.find(
              (u) => u._id?.toString() !== user?._id?.toString()
            );

            if (!otherUser) return null;
            const isOnline = onlineUsers.includes(otherUser._id);

            return (
              <div
                key={chat._id}
                className="w-full flex items-center justify-between bg-[#0f172a]/80 hover:bg-[#1e293b] rounded-xl px-4 py-3 transition duration-200 border border-[#1e293b] cursor-pointer"
                onClick={() => {
                  dispatch(setSelectedChat(chat));
                  dispatch(clearUnread(chat._id));
                }}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="relative">
                    <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center text-lg font-semibold">
                      {otherUser.userName?.charAt(0).toUpperCase()}
                    </div>

                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0f172a] rounded-full"></span>
                    )}
                  </div>

                  <div className="flex-1">
                    <span className="text-gray-100 font-medium">
                      {otherUser.userName}
                    </span>
                  </div>

                  {chat.unreadCount != 0 && (
                    <span className="min-w-5 h-5 px-1 flex items-center justify-center text-xs bg-green-500 text-white rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Chats;