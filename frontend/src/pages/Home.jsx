import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Chats from "../components/chats";
import SideBar from "../components/sideBar";
import SearchResults from "../components/searchResults";
import LaptopSearch from "../components/LaptopSearch";
import MobileSearch from "../components/MobileSearch";
import socket from "../../socket/socket";
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
  const storeLoading = useSelector((state) => state.auth.storeLoading);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!storeLoading && !user) {
      navigate("/signup");
    }
  }, [storeLoading, user, navigate]);


  const fetchOnlineUsers = useCallback(async () => {
    try {
      const res = await api.get("/user/online");
      dispatch(setOnlineUsers(res.data.map((u) => u._id)));
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

useEffect(() => {
  const t1 = setTimeout(fetchOnlineUsers, 2000);
  const t2 = setTimeout(fetchOnlineUsers, 5000);
  const t3 = setTimeout(fetchOnlineUsers, 10000);
  const interval = setInterval(fetchOnlineUsers, 10000);

  return () => {
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);
    clearInterval(interval);
  };
}, [fetchOnlineUsers]);
  useEffect(() => {
    const handleUserOnline = () => fetchOnlineUsers();
    const handleUserOffline = (userId) => dispatch(removeOnlineuser(userId));

    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);

    return () => {
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
    };
  }, [fetchOnlineUsers, dispatch]);

  if (storeLoading) return null;

  return (
    <div className="flex overflow-hidden w-full" style={{ height: "100dvh" }}>
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
          bg-[#0B1220] flex-1 h-full text-gray-400 overflow-hidden min-w-0 
          ${selectedChat ? "block" : "hidden min-[760px]:block"}
        `}
      >
        <ChatBox />
      </div>
    </div>
  );
}

export default Home;