import { useEffect, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { useSelector } from "react-redux";



const AddFile = () => {

  const [open, setOpen] = useState(false);

  const clickHandler = (e) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };
  const { register, handleSubmit } = useForm()

  const user = useSelector((state) => state.auth.user);
  const chat = useSelector((state) => state.chat.selectedChat);

  const otherUser = chat?.participants?.find(
    (u) => u._id !== user?._id
  );

  const onSubmit = async (data) =>{
    console.log(data);
  }

    useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close)
  }, [])



  return (
    <>
<div className="relative">

  {open && (
    <div
      className="
        absolute
        bottom-12
        left-0
        bg-[#230455]
        border
        border-[#2a1845]
        shadow-xl
        rounded-lg
        py-1
        px-1
        w-30
        z-50
      "
      onClick={(e)=> e.stopPropagation()}
    >

      <input
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        id="mediaInput"
        {...register("media", {
          onChange: handleSubmit(onSubmit)
        })}
      />


      <label
        htmlFor="mediaInput"
        className="
          cursor-pointer
          text-gray-300
          text-sm
          p-1
          rounded-md
          block
          transition-all
          duration-300
        "
      >
        Photos/Videos
      </label>


    </div>
  )}


  <GrAttachment
    onClick={(e)=>clickHandler(e)}
    className="
      text-gray-400
      text-lg
      cursor-pointer
      transition-all
      duration-300
      hover:text-purple-300
      hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.9)]
    "
  />

</div>
    </>
  )

}

export default AddFile