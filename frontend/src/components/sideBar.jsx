import { useState } from "react";
import { IoReorderThreeOutline, IoCloseOutline } from "react-icons/io5";
// import Logout from "./logout";
import { useSelector } from "react-redux";

const SideBar = () => {
  const [clicked , setClicked] = useState(false);

  const { user } = useSelector((state) => state.auth);

  return
  (
    <>
    <div>
      className = 
    </div>

    </>
  )

}
