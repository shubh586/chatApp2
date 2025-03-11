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
import { getColor } from "@/lib/utils";
import { HOST, SEARCH_CONTACTS } from "@/utils/constant";
import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
const NewDm = ({doRefresh}) => {
  const { setSelectChatType, setSelectChatData } = useAppStore();
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchAllContacts, setSearchAllContacts] = useState([]);

  const searchContacts = async (searchTerm) => {
    try {

      const response = await apiClient.get(SEARCH_CONTACTS, {
        params: { searchTerm },
        withCredentials: true,
      });
      setSearchAllContacts(response.data.contact);
    } catch (error) {
      error.message
        ? console.log(error.message)
        : console.log("error occured in getting the contact");
    }
  };
  const selectNewConatact = (contact) => {
    setOpenNewContactModal(false);
    setSelectChatType("contact");
    setSelectChatData(contact);
    setSearchAllContacts([]);
    doRefresh();
  };

  
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
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="flex flex-col bg-[#181920] bg-none w-[400px] h-[400px] text-white">
          <DialogHeader>
            <DialogTitle>DialogTrigger</DialogTitle>
            {/* <DialogDescription>DialogTrigger</DialogDescription> */}
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="bg-[#2c2e3b] p-6 border-none rounded-lg"
              onChange={(event) => {
                searchContacts(event.target.value);
              }}
            />
          </div>
          {searchAllContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchAllContacts.length > 0 &&
                  searchAllContacts.map((contact) => (
                    <div
                      key={contact._id}
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => {
                        selectNewConatact(contact);
                      }}
                    >
                      <div className="relative w-12 h-12">
                        <Avatar className="rounded-full w-12 h-12 overflow-hidden">
                          {contact.image ? (
                            <AvatarImage
                              src={`${HOST}/${contact.image}`}
                              className="bg-black rounded-full w-12 h-12 object-cover"
                            />
                          ) : (
                            <AvatarFallback
                              className={`flex justify-center items-center border-[1px] rounded-full w-12 h-12  text-lg uppercase ${getColor(
                                contact.color
                              )}`}
                            >
                              {contact.userName
                                ? contact.userName.split("").shift()
                                : contact.email.split("").shift()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                      <div className="flex flex-col">
                        <span>
                          {contact.userName && contact.lastName
                            ? `${contact.userName} ${contact.lastName}`
                            : contact.email}
                        </span>
                        <span className="text-xs">{contact.email}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          )}

          {searchAllContacts.length <= 0 && (
            <div className="md:flex flex-col flex-1 justify-center items-center md:bg-[#1c1d25] mt-5 transition-all duration-1000">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="flex flex-col justify-center items-center gap-5 mt-5 text-white text-xl lg:text-2xl text-opacity-80 transition-all duration-300">
                <h3 className="roboto-medium">
                  Hi<span className="text-purple-500">!</span> Search new
                  <span className="text-purple-500">Contact.</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewDm;
