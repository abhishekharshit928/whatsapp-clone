import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Chats from "../components/chats";
import SideBar from "../components/sideBar";
import SearchResults from "../components/searchResults";
import LaptopSearch from "../components/LaptopSearch";
import MobileSearch from "../components/MobileSearch";
import socket, { setUserId } from "../../socket/socket";
import ChatBox from "../components/chatBox";
import api from "../api/axios";
import {
  addOnlineUser,
  removeOnlineuser,
  setOnlineUsers,
} from "../store/onlineSlice";

function Home() {
  const user = useSelector((state) => state.auth.user);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const openSearch = useSelector((state) => state.ui.openSearch);

  const dispatch = useDispatch();
  const storeLoading = useSelector((state) => state.auth.storeLoading);
  const navigate = useNavigate();

  const isLoggedIn = Boolean(user);

  useEffect(() => {
    if (!storeLoading && !user) {  
      navigate("/signup");
    }
  }, [storeLoading, user, navigate]);


useEffect(() => {
  const fetchOnlineUsers = async () => {
    try {
      const res = await api.get("/user/online");
      dispatch(setOnlineUsers(res.data.map((u) => u._id)));
    } catch (err) {
      console.log(err);
    }
  };

  fetchOnlineUsers();
}, [dispatch]);


  useEffect(() => {
    if (!user?._id) return;

    const handleUserOnline = (userId) => dispatch(addOnlineUser(userId));
    const handleUserOffline = (userId) => dispatch(removeOnlineuser(userId));

    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);

    setUserId(user._id);

    return () => {
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
    };
  }, [user?._id, dispatch]);

  return (
    <div className="flex overflow-hidden" style={{ height: "100dvh" }}>
      <div
        className={`
        bg-[#111827]
        border-r border-[#243044]
        w-full
        min-[760px]:w-[35%]
        ${selectedChat ? "hidden min-[760px]:block" : "block"}
      `}
      >
        <div className="min-[760px]:hidden flex items-center justify-between px-4 py-3 bg-[#0F172A] border-b border-[#243044]">
          <div className="flex items-center gap-3">
            <SideBar />

            <span className="text-white font-semibold text-lg">NovaChat</span>
          </div>

          <MobileSearch />
        </div>

        <div className="hidden min-[760px]:flex items-center gap-3 p-4">
          <SideBar />

          <LaptopSearch />
        </div>

        {!openSearch && (
          <div className="p-4 text-gray-400">
            <Chats />
          </div>
        )}

        {openSearch && <SearchResults />}
      </div>

      <div
        className={`
        bg-[#0B1220]
        flex-1
        h-full
        text-gray-400
        ${selectedChat ? "block" : "hidden min-[760px]:block"}
      `}
      >
        <ChatBox />
      </div>
    </div>
  );
}

export default Home;