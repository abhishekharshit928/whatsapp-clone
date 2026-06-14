import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useEffect, useState } from "react";
import api from "./api/axios";
import { useDispatch } from "react-redux";
import { setUser } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.post("/auth/refresh");
        dispatch(setUser(res.data.user));
      } catch (error) {
        // no valid session — stay logged out
      } finally {
        setChecking(false);
      }
    };
    restoreSession();
  }, [dispatch]);

  if (checking) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;