import { useState } from "react";
import { IoReorderThreeOutline, IoCloseOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import Logout from "./logout";

const SideBar = () => {
  const [clicked, setClicked] = useState(false);

  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <div
        className="
          p-2
          rounded-lg
          hover:bg-[#1f2937]
          cursor-pointer
          transition
          duration-200
          active:scale-95
        "
        onClick={() => setClicked(true)}
      >
        <IoReorderThreeOutline size={26} className="text-gray-300" />
      </div>

      <div
        onClick={() => setClicked(false)}
        className={`
          fixed inset-0
          bg-black/60
          backdrop-blur-sm
          z-40
          transition-opacity
          duration-300
          ${clicked ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      <div
        className={`
          fixed top-0 left-0
          h-screen
          w-[80%]
          max-w-75
          bg-[#111827]
          z-50
          shadow-2xl
          border-r
          border-[#243044]
          flex
          flex-col
          transform
          transition-transform
          duration-300
          ease-in-out
          ${clicked ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div
          className="
            flex items-center justify-between
            px-4 py-4
            bg-[#0F172A]
            border-b
            border-[#243044]
          "
        >
          <div className="flex items-center gap-2">
            <img
            src="/logo.png"
            alt="NovaChat Logo"
              className="w-9 h-9 rounded-lg object-cover"
            />
            <span
              className="
                text-xl font-bold
                bg-linear-to-r
                from-purple-400
                to-blue-400
                bg-clip-text
                text-transparent
              "
            >
              novaChat
            </span>
          </div>

          <div
            className="
              cursor-pointer
              p-2
              rounded-full
              hover:bg-[#1f2937]
              transition
            "
            onClick={() => setClicked(false)}
          >
            <IoCloseOutline size={24} className="text-gray-300" />
          </div>
        </div>

        <div
          className="
            flex items-center gap-3
            px-4 py-5
            border-b
            border-[#243044]
          "
        >
          <div
            className="
              w-13
              h-13
              rounded-full
              bg-linear-to-r
              from-purple-500
              to-blue-500
              flex
              items-center
              justify-center
              text-white
              font-bold
              text-lg
              shadow-lg
              ring-2
              ring-[#243044]
            "
          >
            {user?.userName?.charAt(0).toUpperCase()}
          </div>

          <div className="flex flex-col">
            <p className="text-white font-semibold text-lg leading-tight">
              {user?.userName}
            </p>
            <span className="text-gray-500 text-sm">
              {user?.email || "Online"}
            </span>
          </div>
        </div>

        <div className="flex-1" />

        <div className="px-4 py-4 border-t border-[#243044]">
          <Logout />
        </div>
      </div>
    </>
  );
};

export default SideBar;