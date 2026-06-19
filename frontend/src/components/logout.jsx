import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import api from "../api/axios";
import { onlogout } from "../store/authSlice";
import { setSelectedChat } from "../store/chatSlice";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      setLoading(true);
      await api.post("/auth/logout");
      dispatch(setSelectedChat(null));
      dispatch(onlogout());
      navigate("/login");
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="
        w-full
        flex items-center gap-3
        px-4 py-3
        rounded-lg
        text-red-400
        font-medium
        border border-[#243044]
        hover:bg-red-500/10
        active:scale-[0.98]
        transition
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      <IoLogOutOutline size={22} />
      <span>{loading ? "Logging out..." : "Logout"}</span>
    </button>
  );
};

export default Logout;