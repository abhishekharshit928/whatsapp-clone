import { useSelector } from "react-redux";
import socket from "../../socket/socket";
import { useEffect} from "react";
import MsgInput from "./msgInput";
import ChatHead from "./chatHead";
import ChatWindow from "./chatWindow";
import DeleteMessage from "./deleteMessage";

const chatBox = () =>{
   const selectedChat = useSelector((state) => state.chat.selectedChat);

  const user = useSelector((state) => state.auth.user);   
  const selectedMessage = useSelector(state => state.selectedMessage.selected)

  useEffect(() => {
    if (!selectedChat?._id || !user?._id) return;

    console.log("Emitting seenMessages:", selectedChat._id);
    socket.emit("seenMessages", { chatId: selectedChat._id });
  }, [selectedChat?._id, user?._id]);

  return (
    <>
    {!selectedChat && (
      <div className="flex justify-center items-center h-full w-full">
        Select chat to start conversation
      </div>
    )}
    {selectedChat && (
      <div className="flex flex-col h-full">
        <ChatHead></ChatHead>

        <div className="flex-1 overflow-y-auto ultra-thin-scroll">
          <ChatWindow></ChatWindow>
        </div>

        {selectedMessage ?.length === 0 ? <MsgInput></MsgInput> : <DeleteMessage></DeleteMessage>}
      </div>
    )}
    </>
  )
}

export default chatBox;
