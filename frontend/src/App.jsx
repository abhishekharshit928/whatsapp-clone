import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useEffect, useState } from "react";
import api from "./api/axios";
import { useDispatch } from "react-redux";
import { setUser } from "./store/authSlice";
import socket from "./socket/socket.js";


function App() {
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.post("/auth/refresh");
        dispatch(setUser(res.data.user));
      } catch (error) {
      } finally {
        setChecking(false);
      }
    };
    restoreSession();
  }, [dispatch]);

    useEffect(() => {
    if (user?._id) {
      console.log("Emitting join for user:", user._id);
      socket.emit("join", user._id);
    }
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