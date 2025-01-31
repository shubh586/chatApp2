import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
  const emojiRef = useRef();
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendMessages = async () => {};

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPicker(false);
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-center items-center bg-[#1c1d25] px-8 h-[10vh]">
      <div className="flex flex-1 items-center gap-4 bg-[#2a2b33] px-4 py-3 rounded-md">
        <input
          type="text"
          className="flex-1 bg-transparent px-3 py-2 rounded-md focus:outline-none"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="text-neutral-500 hover:text-white transition-all">
          <GrAttachment className="text-2xl" />
        </button>
        <div className="relative">
          <button
            className="text-neutral-500 hover:text-white transition-all"
            onClick={() => setEmojiPicker(!emojiPicker)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          {emojiPicker && (
            <div className="right-0 bottom-16 absolute" ref={emojiRef}>
              <EmojiPicker
                theme="dark"
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
      </div>
      <button
        className="flex justify-center items-center bg-[#8417ff] hover:bg-[#741bda] ml-3 p-4 rounded-md transition-all"
        onClick={handleSendMessages}
      >
        <IoSend className="text-2xl text-white" />
      </button>
    </div>
  );
};

export default MessageBar;
