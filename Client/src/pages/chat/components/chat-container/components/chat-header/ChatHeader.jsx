import { useAppStore } from "@/store";
import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { HOST } from "@/utils/constant";
import { getColor } from "@/lib/utils";
const ChatHeader = () => {
  const { closeChat, selectChatData, selectChatType } = useAppStore();
  return (
    <div className="flex justify-between items-center border-[#2f303b] px-20 border-b-2 h-[10vh]">
      <div className="flex justify-between items-center gap-5 w-full">
        <div className="flex justify-center items-center gap-3">
          <div className="relative w-12 h-12">
            {selectChatType === "contact" ? (
              <Avatar className="rounded-full w-12 h-12 overflow-hidden">
                {selectChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectChatData.image}`}
                    className="bg-black rounded-full w-12 h-12 object-cover"
                  />
                ) : (
                  <AvatarFallback
                    className={`flex justify-center items-center border-[1px] rounded-full w-12 h-12  text-lg uppercase ${getColor(
                      selectChatData.color
                    )}`}
                  >
                    {selectChatData.userName
                      ? selectChatData.userName.split("").shift()
                      : selectChatData.email.split("").shift()}
                  </AvatarFallback>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 rounded-full flex items-center justify-center ">
                #
              </div>
            )}
          </div>
          <div>
            {selectChatType === "channel" && selectChatData.name}
            {selectChatType === "contact" && selectChatData.userName
              ? `${selectChatData.userName} ${selectChatData.lastName}`
              : selectChatData.email}
          </div>
        </div>
        <div className="flex justify-center items-center gap-5">
          <button
            className="focus:border-none text-neutral-500 focus:text-white transition-all duration-300 focus:outline-none"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
