import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  
  import { GET_ALL_CONTACTS ,CREATE_CHANNELS} from "@/utils/constant.js";
  // import Lottie from "react-lottie";
  import { useEffect, useState } from "react";
  import { FaPlus } from "react-icons/fa";
  import { Input } from "@/components/ui/input";
  // import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
  import { apiClient } from "@/lib/api-client";
  import { useAppStore } from "@/store";
  import MultipleSelector from "@/components/ui/Multipleselect"
  const CreateChannel= ({doRefresh}) => {
    const { setSelectChatType, setSelectChatData,addChannel } = useAppStore();
    const [openNewContactModal, setOpenNewContactModal] = useState(false);

    const [searchAllContacts, setSearchAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [channelName, setChannelName] = useState("");
    useEffect(() => {
      const getAllContacts = async () => {
        try {
          const response = await apiClient.get(GET_ALL_CONTACTS, {
            withCredentials: true,
          });
          setSearchAllContacts(response.data.contacts);
        } catch (error) {
          error.message
            ? console.log(error.message)
            : console.log("error occured in getting the contact");
        }
      };
      getAllContacts();
    }, []);
    
    const CreateChannel=async()=>{
      try {
         const response=await apiClient.post(CREATE_CHANNELS,{
          name:channelName,
          members:selectedContacts.map((contact)=>(contact.value))},{withCredentials:true});
          console.log(response.data.channel);
          setSelectedContacts([]);
          setChannelName("");
          setOpenNewContactModal(false);
          addChannel(response.data.channel);
          doRefresh()
      } catch (error) {
        error.message?console.log(error.response.data.message):console.log("error occured in creating channel");
      }
    }
  
    return (
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaPlus
                className="font-light text-neutral-400 text-start hover:text-neutral-100 text-opacity-90 transition-all duration-300 cursor-pointer"
                onClick={() => setOpenNewContactModal(true)}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] mb-2 p-3 border-none text-white">
              Create New Channel
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
          <DialogContent className="flex flex-col bg-[#181920] bg-none w-[400px] h-[400px] text-white">
            <DialogHeader>
              <DialogTitle>Please fill up the details for new channel</DialogTitle>
              {/* <DialogDescription>DialogTrigger</DialogDescription> */}
            </DialogHeader>
            <div>
              <Input
                placeholder="Channel Name"
                className="bg-[#2c2e3b] p-6 border-none rounded-lg"
                value={channelName}
                onChange={(event) => {
                  setChannelName(event.target.value);
                }}
              />
            </div>
            <div>
                <MultipleSelector className="  bg-[#2c2e3b] py-2 border-none rounded-lg  text-white"
                defaultOptions={searchAllContacts}
                placeholder="Select Members"
                value={selectedContacts}
                onChange={setSelectedContacts}
                emptyIndicator={
                  <p className="text-center text-lg text-gray-600 leading-10">
                    No result found
                  </p>
                }
                />

            </div>
            <div>
              <button className=" rounded-lg w-full bg-purple-700 hover:bg-purple-900 p-3 transition-all duration-300"
              onClick={CreateChannel}>
                Create Channel
              </button>
            </div>


          </DialogContent>
        </Dialog>
      </div>
    );
  };
  
  export default CreateChannel;
  