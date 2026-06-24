import { CiFaceSmile } from "react-icons/ci";
import { FaMicrophone } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSelector } from "react-redux";
 import AddFile from "./file";
import EmojiPicker from "emoji-picker-react";


const  MsgInput = () => {

  const [text , setText] = useState("");
    const user = useSelector((state) => state.auth.user);
    const chat = useSelector((state) => state.chat.selectedChat);
    const [showEmojiPicker, setEmojiPicker] = useState(false)

    
const otherUser = chat?.participants?.find(
    (u) => u._id?.toString() !== user?._id?.toString()
);
    const aiChatBot = otherUser?.isAI;

    const handleKeyDown = (e) => {
      if(e.key === "Enter" && !e.shiftKey){
        e.preventDefault();
        sendMessage();
      }
    }

    const sendMessage = async () => {
    try{
      if(!otherUser?._id){
        console.log("no reciever selected");
        return;
      }
      if(!text.trim()) return;

      const messageText = text;
      setText("");

      const res = await api.post("/messages/send",{
        reciever: otherUser._id,
        message: messageText,
      })

      window.dispatchEvent(new CustomEvent("localMessage",{detail:res.data}));
    } catch(error){
      console.log("error in sending msg", error);
    }
  };

  
    const handelEmojiPicker = (e) => {
        e.stopPropagation();
        setEmojiPicker((prev) => !prev);
    }

      useEffect(() => {
        const close = () => setEmojiPicker(false);
        window.addEventListener("click", close);
        return () => {
            window.removeEventListener("click", close);
        };
    }, []);

    const handleEmojiClick = (emojiData) => {
      setText((prev) => prev + emojiData.emoji);
    }

    return (
      <>
      <div className="
        w-full
        h-15
        bg-[#0b1020]/80
        border-t
         border-white/10
        flex items-center px-4  gap-3 backdrop-blur-xl

      ">

        {!aiChatBot && <AddFile/>}
        {aiChatBot && (
  <span className="
    text-xs
    ml-2
    px-2
    py-0.5
    rounded-full
    bg-linear-to-r
    from-indigo-500/20
    to-purple-500/20
    text-purple-300
    border
    border-purple-400/30
  ">
    AI
  </span>
)}

  <input 
  type="text" 
  value={text}
  onKeyDown={handleKeyDown}
  onChange = {(e) => setText(e.target.value)}
  placeholder="Type a message"
  className="
    flex-1
    h-11
    px-4
    rounded-2xl
    bg-white/5
    border
    border-white/10
    text-gray-200
    placeholder-gray-500
    outline-none
    focus:ring-2
    focus:ring-indigo-500/40
  "
  />

 <div
  className="relative"
  onClick={(e) => e.stopPropagation()}
>

  <CiFaceSmile
    size={25}
    className="text-gray-400 cursor-pointer hover:text-white transition"
    onClick={(e) => handelEmojiPicker(e)}
  />


  {showEmojiPicker && (
    <div
      className="
        absolute 
        bottom-12 
        right-0
        z-50
        shadow-2xl
        rounded-xl
        overflow-hidden
      "
    >

      <EmojiPicker
      theme="dark"
        onEmojiClick={(emojiData, event) => {
          event.stopPropagation();
          handleEmojiClick(emojiData);
        }}

        height={350}
        width={300}

        previewConfig={{
          showPreview:false
        }}
        searchDisabled={false}
      />

    </div>
  )}

</div>

    <IoSend
      size={20}
      className={`text-xl transition ${text.trim().length>0 ? "text-gray-400" : "text-gray-400 cursor-not-allowed opacity-50" } hover:text-white transition"
      }`}
        
      onClick={(e) => {
          e.stopPropagation();
          if(text.trim().length === 0) return;
          sendMessage();
        }}
    />
      </div>
      </>
    )
}

export default MsgInput;