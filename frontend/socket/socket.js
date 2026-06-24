import { io } from "socket.io-client";

const socket = io( import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket" , "polling"],
  reconnection: true,
  reconnectionAttempts: "infinity",
  reconnectionDelay: 1000,
});

socket.on("connect", () => console.log("Socket connected"));
socket.on("connect_error", (err) => console.error("Socket error:", err));
export default socket;