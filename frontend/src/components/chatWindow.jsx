import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import socket from "../../socket/socket.js";
import { removeSelectedMessage, setSelectedMessage } from "../store/selectMessageSlice";
import ChatHead from "./chatHead";

const ChatWindow = () => {
  const user = useSelector(state => state.auth.user);
  const selectedChat = useSelector(state => state.chat.selectedChat);
  const selectedMessage = useSelector(state => state.selectedMessage.selected);

  const dispatch = useDispatch();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);

  const otherUser = selectedChat?.participants?.find(
    u => u._id.toString() !== user?._id?.toString()
  );

  const bottomRef = useRef(null);


  useEffect(() => {
    if (!selectedChat?._id) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/messages/fetchmessage/${selectedChat._id}`
        );

        setMessages(res.data);

      } catch (error) {
        console.log(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

  }, [selectedChat?._id]);


  const handelSelection = (e,msg) => {
    e.preventDefault();
    e.stopPropagation();

    const alreadySelected = selectedMessage.some(
      m => m._id === msg._id
    );

    if(alreadySelected){
      dispatch(removeSelectedMessage(msg._id));
    }
    else{
      dispatch(setSelectedMessage(msg));
    }
  };


  useEffect(() => {

    const handleNewMessage = message => {

      if(
        message.chatId?.toString() ===
        selectedChat?._id?.toString()
      ){

        setMessages(prev => [...prev,message]);

        socket.emit(
          "seenMessages",
          {chatId:selectedChat._id}
        );

      }

    };


    socket.on(
      "newMessage",
      handleNewMessage
    );
    return ()=>socket.off(
      "newMessage",
      handleNewMessage
    );

  },[selectedChat?._id]);



  useEffect(()=>{

    const handleAiTyping = ({chatId,status})=>{

      if(
        chatId?.toString() !==
        selectedChat?._id?.toString()
      ) return;

      setAiTyping(status);

    };


    socket.on(
      "aiTyping",
      handleAiTyping
    );


    return ()=>socket.off(
      "aiTyping",
      handleAiTyping
    );

  },[selectedChat?._id]);



  useLayoutEffect(()=>{

    if(messages.length===0)return;

    const box =
    bottomRef.current?.parentElement?.parentElement;

    if(!box)return;

    requestAnimationFrame(()=>{
      box.scrollTop = box.scrollHeight;
    });

  },[messages]);



  useEffect(()=>{

    const handleSeen = ({chatId})=>{

      if(chatId !== selectedChat?._id)return;

      setMessages(prev=>
        prev.map(msg=>
          msg.senderId?.toString() === user?._id?.toString()
          ?
          {...msg,seen:true}
          :
          msg
        )
      );

    };


    socket.on(
      "messagesSeen",
      handleSeen
    );


    return ()=>socket.off(
      "messagesSeen",
      handleSeen
    );

  },[selectedChat?._id,user?._id]);



  useEffect(()=>{

    const handleDeletedMessages = delMsg => {

      setMessages(prev =>
        prev.filter(
          msg =>
          !delMsg.some(
            del=>del._id===msg._id
          )
        )
      );

    };


    const handleDeleteForEveryone = delMsg => {

      setMessages(prev =>
        prev.map(msg =>
          delMsg.some(
            del=>del._id===msg._id
          )
          ?
          {...msg,isDeleted:true}
          :
          msg
        )
      );

    };


    socket.on(
      "messagesDeleted",
      handleDeletedMessages
    );

    socket.on(
      "messagesDeletedForEveryone",
      handleDeleteForEveryone
    );


    return ()=>{

      socket.off(
        "messagesDeleted",
        handleDeletedMessages
      );

      socket.off(
        "messagesDeletedForEveryone",
        handleDeleteForEveryone
      );

    };


  },[]);



  useEffect(()=>{

    const handleChatCleared = chatId => {

      if(chatId === selectedChat?._id){
        setMessages([]);
      }

    };


    socket.on(
      "chatCleared",
      handleChatCleared
    );


    return ()=>socket.off(
      "chatCleared",
      handleChatCleared
    );


  },[selectedChat]);



  return (

<div className="p-4 space-y-3 pb-10">

{loading && (
<div className="flex justify-center items-center">
<div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"/>
</div>
)}


{!loading && messages.length===0 && (
<p className="text-center text-gray-400 mt-10">
Start a conversation 🚀
</p>
)}



{messages.map(msg=>{

const isMe =
msg.senderId?.toString() === user?._id?.toString();


const isSelected =
selectedMessage.some(
m=>m._id===msg._id
);


return(

<div
key={msg._id}
onContextMenu={(e)=>handelSelection(e,msg)}
className={`
px-4 py-3 rounded-3xl max-w-[75%]
text-sm shadow-lg
${isMe
?"ml-auto bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
:"bg-white/5 backdrop-blur-md border border-white/10 text-gray-200"
}
${isSelected?"ring-2 ring-purple-400":""}
`}
>


<div>
{
msg.isDeleted
?
<span className="italic text-gray-400">
This message was deleted
</span>
:
msg.text
}
</div>


<div className="flex justify-end gap-1 text-[10px] mt-2">

<span>
{
new Date(msg.createdAt)
.toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
})
}
</span>


{isMe && (
msg.seen
?
<span className="text-cyan-300">✔✔</span>
:
<span>✔</span>
)}

</div>


</div>

)

})}



{aiTyping && otherUser?.isAI && (
<div className="bg-white/5 px-4 py-3 rounded-3xl italic animate-pulse">
NovaChat AI is typing...
</div>
)}


<div ref={bottomRef}/>

</div>

)

}

export default ChatWindow;