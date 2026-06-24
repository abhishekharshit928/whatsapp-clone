import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useEffect, useState } from "react";
import api from "./api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./store/authSlice";
import socket from "../socket/socket.js";

function App() {
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.post("/auth/refresh", null, {
  _isSessionRestore: true  
});
        dispatch(setUser(res.data.user));
      } catch (error) {
        console.log(error);
      } finally {
        setChecking(false);
      }
    };
    restoreSession();
  }, [dispatch]);

useEffect(() => {
  if (!user?._id) return;

  // Emit on initial connect
  socket.emit("join", user._id);

  // Re-emit on every reconnect
  const handleReconnect = () => {
    socket.emit("join", user._id);
  };

  socket.on("connect", handleReconnect);

  return () => {
    socket.off("connect", handleReconnect);
  };
}, [user]);

  if (checking) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-gray-900 to-indigo-950 flex flex-col items-center justify-center">
        <img
          src="/logo.png"
          alt="NovaChat Logo"
          className="w-24 h-24 mb-4 rounded-full shadow-lg"
        />
        <p className="text-purple-400 text-lg tracking-wide">Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;