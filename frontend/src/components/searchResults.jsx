import { useSelector, useDispatch } from "react-redux";
import { setSelectedChat } from "../store/chatSlice";
import api from "../api/axios";
import { useState } from "react";

const SearchResults = () => {

  const results = useSelector((state) => state.results.results);
  const dispatch = useDispatch();

  const [loadingId, setLoadingId] = useState(null);
 const onlineUser = useSelector((state) => state.onlineUsers.users);

 const fetchChats = async (user) =>{
  try{
    setLoadingId(user._id);

    const res = await api.get("/chats/findchat",{
      otherUserId: user._id
    })
    dispatch(setSelectedChat(res.data));

  }catch(error){
    console.log("fetch chat error", error.response?.data || error.message);
  }finally{
    setLoading(null);
  }
 }

 return (
<>
  <div className="max-w-2xl mx-auto space-y-3 h-screen overflow-y-auto ultra-thin-scroll">
    {results.length === 0 && (
      <p className="text-center text-gray-500 mt-6">
        No users found
      </p>
    )}

    {results.map((user) => {
      const isOnline = onlineUsers.includes(user._id);

      return (
        <div
          key={user._id}
          onClick={() => fetchChats(user)}
          className={`w-full flex items-center justify-between backdrop-blur-md rounded-xl px-4 py-3 transition duration-200 border cursor-pointer ${
            loadingId === user._id
              ? "bg-[#1f2937] opacity-70"
              : "bg-[#111827] hover:bg-[#1f2937] border-[#243044]"
          }`}
        >
          <div className="flex items-center gap-3">

            <div className="relative">

              <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center text-lg font-semibold">
                {user.userName?.charAt(0).toUpperCase()}
              </div>

              {isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#111827] rounded-full" />
              )}

            </div>

            <span className="text-gray-200 font-medium">
              {user.userName}
            </span>

          </div>

          {loadingId === user._id && (
            <span className="text-xs text-gray-400">
              Opening...
            </span>
          )}

        </div>
      );
    })}

  </div>
</>
 )


}

export default SearchResults