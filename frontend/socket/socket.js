import { io } from "socket.io-client";

const socket = io("https://whatsapp-clone-fcp2.onrender.com", {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;