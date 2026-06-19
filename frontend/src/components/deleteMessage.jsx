import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { removeAllSelectedMessage } from "../store/selectMessageSlice";
import api from "../api/axios";

const DeleteMessage = () =>{
  const selectedMessage = useSelector(
    state => state.selectedMessage.selected
  );

  const dispatch = useDispatch()

const handelDeleteMe = async ()=>{
try {
const res = await api.delete("/messages/deleteforme",{data:{selectedMessage}})
dispatch(removeAllSelectedMessage())
} catch (error) {
    console.log(error)
}
}
const user = useSelector((state) => state.auth.user);

const allSelectedMine = selectedMessage.every(
  msg => msg.senderId.toString() === user._id.toString()
)

const selectedContainsDeleted = selectedMessage.some(
    msg => msg.isDeleted === true
)



const handelDeleteEveryone = async ()=>{
    try {
        const res = await api.delete("/messages/deleteforeveryone", {data: { selectedMessage }});
        dispatch(removeAllSelectedMessage())
    } catch (error) {
        console.log(error)
    }
    
}

return (
  <div className="w-full h-16 bg-[#111827] border-t border-[#243044] flex items-center justify-between px-5 backdrop-blur-md">

  <div className="text-purple-300 font-semibold text-sm tracking-wide">
    {selectedMessage.length} selected
  </div>

  <div className="flex items-center gap-3 text-sm">

    {allSelectedMine && !selectedContainsDeleted ? (
      <>
        <button
          className="px-3 py-1 rounded-md text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          onClick={handelDeleteEveryone}
        >
          Delete for everyone
        </button>

        <button
          className="px-3 py-1 rounded-md text-orange-400 hover:bg-orange-500/10 hover:text-orange-300 transition"
          onClick={handelDeleteMe}
        >
          Delete for me
        </button>
      </>
    ) : (
      <button
        className="px-3 py-1 rounded-md text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
        onClick={handelDeleteMe}
      >
        Delete for me
      </button>
    )}

    <button
      className="p-2 rounded-md text-gray-300 hover:bg-[#1f2937] hover:text-white transition"
      onClick={() => dispatch(removeAllSelectedMessage())}
    >
      <RxCross2 className="text-lg" />
    </button>

  </div>

</div>
)


}

export default DeleteMessage