import React from "react";
import { useEffect } from "react";
import axios from "axios";
import Chats from "../components/chats";
import ChatWindow from "../components/chatWindow";
import MsgInput from "../components/MsgInput";

function Home() {
  return (
    <>
    <div className= "flex h-full">
      <div
      className="w-1/3 bg-slate-900 border-r border-white/10"
      >
        <Chats/>
      </div>

      <div
      className= "flex-1 bg-slate-950 flex flex-col"
      >

        <div className="*flex-1 overflow-hidden">
           <ChatWindow/>
        </div>
         
          <MsgInput/>
      </div>
    </div>
    </>
  );
}

export default Home;