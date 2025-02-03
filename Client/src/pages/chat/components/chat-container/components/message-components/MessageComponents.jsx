import { useRef, useEffect } from "react";
import { useAppStore } from "@/store";
import moment from "moment";
const MessageComponents = () => {
  const scrollRef = useRef();
  const { selectChatType, selectChatData, userInfo, selectChatMessages } =
    useAppStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectChatMessages]);

  const renderMessages = () => {
    let lastDate = null;

    return (
      selectChatMessages.length > 0 &&
      selectChatMessages.map((message, index) => {
        const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
        const showDate = messageDate !== lastDate;
        lastDate = messageDate;
        return (
          <div key={index}>
            {showDate && (
              <div className="my-2 text-center text-gray-500">
                {moment(message.timestamp).format("LL")}
              </div>
            )}
            {selectChatType === "contact" && renderDMMessages(message)}
          </div>
        );
      })
    );
  };

  const renderDMMessages = (message) => {
    return (
      <div
        className={`${
          message.sender === selectChatData._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== selectChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"
            } border inline-block p-4 rounded-lg my-1 max-w-[50% break-words]`}
          >
            {message.content}
          </div>
        )}
        <div className="text-gray-600 text-xs">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 scrollbar-hidden px-8 p-4 w-full md:w-[65vw] lg:w-[70vw] xl:w-[80vw] overflow-auto">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageComponents;
