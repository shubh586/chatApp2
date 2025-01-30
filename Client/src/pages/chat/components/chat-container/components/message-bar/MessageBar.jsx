import EmojiPicker from "emoji-picker-react";
import { document } from "postcss";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
  const emojiRef = useRef();
  const [emojiPicker, setEmojiPicker] = useState(false);
  const handleSendMessages = async () => {};
  const [message, setMessage] = useState("");
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPicker(false);
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [emojiRef]);
  return (
    <div className="flex justify-center items-center px-8 h-[10vh] bg=[#1c1d25]">
      <div className="flex flex-1 items-center gap-5 bg-[#2a2b33] pr-5 rounded-md">
        <input
          type="text"
          className="flex-1 bg-transparent p-5 focus:border-none rounded-md focus:outline-none"
          placeholder="Enter  message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="focus:border-none text-neutral-500 focus:outline-none focus:text-white transition-all duration-300">
          <GrAttachment className="text-2xl" />
        </button>
        <div className="relative">
          <button
            className="focus:border-none text-neutral-500 focus:outline-none focus:text-white transition-all duration-300"
            onClick={() => setEmojiPicker(true)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="right-0 bottom-16 absolute" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPicker}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="focus:border-none focus:outline-none flex justify-center items-center gap-2 bg-[#8417ff] hover:bg-[#741bda] focus:bg-[#741bda] p-5 rounded-md focus:text-white transition-all duration-300"
        onClick={handleSendMessages}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
