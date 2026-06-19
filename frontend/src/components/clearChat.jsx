import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import api from "../api/axios";

const ClearChat = () =>{

  const selectedChat = useSelector(state => state.chat.selectedChat);
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const handleClearChat  =async() =>{
    try{
      if(!selectedChat) return
      setLoading(true)
      const res = await api.delete("/messages/deleteAllforme",
        {
          data:{chatId:selectedChat._id}
        }
      );
      setShow(false)

    }catch(error){
      console.log(error.response?.data || error.message);

    }finally{
      setLoading(false)
    }
  }

  useEffect(() =>{

    const handleClick = ()=>{
      setShow(false);
    }

    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  } ,[]);

 return (
  <>
<div className="relative">

  <BsThreeDotsVertical
    className="text-gray-400 text-lg cursor-pointer hover:text-white transition"
    onClick={(e) => {
      e.stopPropagation();
      setShow((prev) => !prev);
    }}
  />


  {show && (
    <div
      className="
      absolute 
      right-0 
      top-8 
      w-40 
      bg-[#111827]
      border 
      border-[#243044]
      rounded-lg
      shadow-xl
      overflow-hidden
      z-50
      "
    >

      <button
        disabled={loading}
        className="
        px-4 
        py-2 
        text-sm 
        text-gray-200
        hover:bg-[#1f2937]
        w-full 
        text-left
        transition
        disabled:opacity-50
        "
        onClick={(e) => {
          e.stopPropagation();
          handleClearChat();
        }}
      >
        {loading ? "Clearing..." : "Clear Chat"}
      </button>
    </div>
  )}

</div>
  </>
);
}

export default ClearChat