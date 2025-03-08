
import { useAppStore } from "@/store";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constant.js";




const ContactList = ({ contacts,isChannel=false }) => {
const {selectChatData,setSelectChatData,selectChatType,setSelectChatType,setSelectChatMessages}=useAppStore();
const handleClick=(contact)=>{
  if(isChannel){
    setSelectChatType("channel");
  }else{
    setSelectChatType("contact");
  }
  if(selectChatData && selectChatData._id!==contact._id){
    setSelectChatMessages([]);
  }
  setSelectChatData(contact);
}

  return (
    <div className="mt-5">
      {contacts && contacts.map((contact, index) => (
        <div
          key={index}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectChatData && selectChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
          {
            !isChannel && <Avatar className="rounded-full w-10 h-10 overflow-hidden">
            {contact.image ? (
              <AvatarImage
                src={`${HOST}/${contact.image}`}
                className="bg-black  w-full h-full object-cover"
              />
            ) : (
              <AvatarFallback
                className={`
                  ${selectChatData && selectChatData._id === contact._id  ? "bg-[#ffffff22] border-white/70  border-2":getColor(
                    contact.color)
                  }
                  flex justify-center items-center border-[1px] rounded-full w-10 h-10  text-lg uppercase `}
              >
                {contact.userName
                  ? contact.userName.split("").shift()
                  : contact.email.split("").shift()}
              </AvatarFallback>
            )}
          </Avatar>
          }
          {
            isChannel && <div className="bg-[#ffffff22] h-10 w-10 rounded-full flex items-center justify-center ">#</div>
          }
          {
            isChannel?<span>{contact.name}</span>:<span>{  contact.userName? `${contact.userName} ${contact.lastName}`:`${contact.email}`}</span>
          }
          </div>
        </div>
      ))}
    </div>
  );
};
export default ContactList;
