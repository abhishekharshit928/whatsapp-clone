import { io } from "socket.io-client";

const socket = io( import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket" , "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

let currentUserId = null;
let listenersReady = false;

export const setListenersReady = () => {
  listenersReady = true;
  if (currentUserId && socket.connected) {
    socket.emit("join", currentUserId);
  }
};

export const setUserId = (userId) => {
  currentUserId = userId;
  if (listenersReady && socket.connected && userId) {
    socket.emit("join", userId);
  }
};

socket.on("connect", () => {
  console.log("Socket connected");
  if (listenersReady && currentUserId) {
    socket.emit("join", currentUserId);
  }
});

socket.on("connect_error", (err) => console.error("Socket error:", err));
export default socket;
