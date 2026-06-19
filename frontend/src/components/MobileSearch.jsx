import { IoSearch, IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { closeSerachScreen, openSearchScreen } from "../store/uiSlice";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { setResults } from "../store/resultSlice";

const MobileSearch = () => {
  const dispatch = useDispatch();
  const { openSearch } = useSelector((state) => state.ui);
  const [query, setQuery] = useState("");

  const [loading , setLoading] = useState(false);

    const fetchResult = async () => {
    try {

      if (query.trim().length <= 2) return;

      setLoading(true);

      const res = await api.get(`/search/input?q=${query}`);
      dispatch(setResults(res.data));

    } catch (error) {
      console.log("error fetching search results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if (!query) {
      dispatch(setResults([]));
      return;
    }

    const timer = setTimeout(fetchResult, 400);
    return () => clearTimeout(timer);

  }, [query]);
 
  return (
    <>
    {!openSearch && (
  <IoSearch
    className="text-gray-300 text-xl cursor-pointer min-[760px]:hidden hover:text-white transition"
    onClick={()=>dispatch(openSearchScreen())}
  />
)}

{openSearch && (
  <div className="fixed top-0 left-0 w-full p-3 bg-[#111827] z-50 flex items-center gap-2 min-[760px]:hidden border-b border-[#243044]">

    <div className="relative flex-1">

      <input
        autoFocus
        type="text"
        value={query}
        placeholder="Search chats..."
        className="w-full bg-[#0b1220] text-gray-200 placeholder:text-gray-500 px-4 py-2.5 pr-10 rounded-xl border border-[#243044] outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
        onChange={(e)=>setQuery(e.target.value)}
      />

      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      )}

    </div>

    <IoClose
      className="text-gray-300 hover:text-white text-2xl cursor-pointer transition"
      onClick={()=>{
        dispatch(closeSerachScreen());
        setQuery("");
      }}
    />

  </div>
)}
    </>
  )
}

export default MobileSearch