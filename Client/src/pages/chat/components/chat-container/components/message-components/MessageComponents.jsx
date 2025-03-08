import { useRef, useEffect } from "react";
import { useAppStore } from "@/store";
import moment from "moment";
import { GET_CHANNEL_MESSAGES, GET_MESSAGES, HOST } from "@/utils/constant.js";
import { apiClient } from "@/lib/api-client.js";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";
import { getColor } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const MessageComponents = () => {
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const scrollRef = useRef(null);
  const {
    selectChatType,
    selectChatData,
    userInfo,
    selectChatMessages,
    setSelectChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore();
  const downLoadFile = async (url) => {
    try {
      if (typeof document === "undefined") {
        console.error("Document is not available");
        return;
      }
      setIsDownloading(true);
      setFileDownloadProgress(0);
      const response = await apiClient.get(`${HOST}/${url}`, {
        responseType: "blob",
        onDownloadProgress: (e) => {
          const { loaded, total } = e;
          if (total) {
            setFileDownloadProgress(Math.round((100 * loaded) / total));
          }
        },
      });
      const urlblob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlblob;
      link.setAttribute("download", url.split("/").pop().substring(13));
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlblob);
      setIsDownloading(false);
    } catch (error) {
      console.log(error, "in the download file");
      setIsDownloading(false);
      setFileDownloadProgress(0);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [selectChatMessages]);

  useEffect(() => {
    if (!selectChatData?._id) return;
    const getMessages = async () => {
      console.log("in the getmessages");
      try {
        const response = await apiClient.post(
          GET_MESSAGES,
          { id: selectChatData._id },
          { withCredentials: true }
        );
        console.log(response.data.messages, "response in getting messages");
        setSelectChatMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectChatData._id}`,
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selectChatData._id) {
      if (selectChatType === "contact") getMessages();
      if (selectChatType === "channel") getChannelMessages();
    }
  }, [selectChatType, selectChatData, userInfo]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

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
            {selectChatType === "channel" && renderChannelMessages(message)}
          </div>
        );
      })
    );
  };

  const renderChannelMessages = (message) => {
    return (
      <div
        className={` mt-5 ${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >


{message.sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="rounded-full w-8 h-8 overflow-hidden">
              {message.sender.image ? (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  className="bg-black rounded-full w-8 h-8 object-cover"
                />
              ) : (
                <AvatarFallback
                  className={`flex justify-center items-center border-[1px] rounded-full w-8 h-8  text-lg uppercase ${getColor(
                    message.sender.color
                  )}`}
                >
                  {message.sender.userName
                    ? message.sender.userName.split("").shift()
                    : message.sender.email.split("").shift()}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-sm text-white/60">
              {message.sender.userName} {message.sender.lastName}
            </span>
            <span className="text-xs text-white/60">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        ) : (
          <div className="text-xs text-white/60">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"
            } border inline-block p-2 rounded-lg my-1 max-w-[50%]  break-words
  `}
          >
            {message.content}
          </div>
        )}


        {message.messageType === "file" && (
          <div
            className={`${
              message.sender._id !== userInfo._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"
            } border inline-block p-4 rounded-lg my-1 max-w-[50%]  break-words
  `}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt=""
                  className="h-300 w-300"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="p-3 text-3xl rounded-full bg-[#2a2b33]  text-white/8 ">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop().substring(13)}</span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full cursor-pointer duration-300 transition-all hover:bg-black/50"
                  onClick={() => downLoadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
      </div>
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
            } border inline-block p-3 rounded-lg my-1 max-w-[50%]  break-words
`}
          >
            {message.content}
          </div>
        )}

        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== selectChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"
            } border inline-block p-4 rounded-lg my-1 max-w-[50%]  break-words
`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt=""
                  className="h-300 w-300"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="p-3 text-3xl rounded-full bg-[#2a2b33]  text-white/8 ">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop().substring(13)}</span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full cursor-pointer duration-300 transition-all hover:bg-black/50"
                  onClick={() => downLoadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
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
      {showImage && (
        <div
          className="fixed z-1000 top-0 left-0 h-screen w-screen bg-black/80 flex justify-center items-center backdrop-blur-lg flex-col"
          onClick={() => setShowImage(false)}
        >
          <div>
            <img
              src={`${HOST}/${imageUrl}`}
              alt=""
              className="h-[80vh] bg-cover w-full"
            />
          </div>
          <div className="gap-5 top-0 flex fixed mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full cursor-pointer duration-300 transition-all hover:bg-black/50"
              onClick={() => downLoadFile(imageUrl)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full cursor-pointer duration-300 transition-all hover:bg-black/50"
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageComponents;
