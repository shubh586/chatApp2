import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  return (
    <div className="flex justify-between items-center border-[#2f303b] px-20 border-b-2 h-[10vh]">
      <div className="flex items-center gap-5">
        <div>
          {" "}
          <div className="flex justify-center items-center gap-3"></div>
          <div className="flex justify-center items-center gap-5">
            <button className="focus:border-none text-neutral-500 focus:outline-none focus:text-white transition-all duration-300">
              <RiCloseFill className="text-3xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
