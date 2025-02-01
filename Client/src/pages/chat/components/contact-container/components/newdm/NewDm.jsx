import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
const NewDm = () => {
  const navigate = useNavigate();
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchAllContacts, setSearchAllContacts] = useState([]);

  const searchContacts = async (search) => {};

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
              className="p-6 border-none rounded-lg b-[#2c2e3b]"
              onChange={(event) => {
                searchContacts(event.target.value);
              }}
            />
          </div>
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
