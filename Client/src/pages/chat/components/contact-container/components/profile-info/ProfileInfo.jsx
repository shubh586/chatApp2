import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useState } from "react";
import { useAppStore } from "@/store";
import { useEffect } from "react";
import { HOST, LOGOUT_USER } from "@/utils/constant.js";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import { getColor } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

const ProfileInfo = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const { userInfo, setUserInfo } = useAppStore();
  useEffect(() => {
    if (userInfo.image) {
      setImage(userInfo.image);
    }
  }, [userInfo]);
  const LogOut = async () => {
    try {
      const response = await apiClient.post(LOGOUT_USER, {
        withCredentials: true,
      });

      response.data.message
        ? console.log(response.data.message)
        : console.log(response.data);
      setUserInfo(null);
      navigate("/auth");
      toast.success("user logout sucessfully");
    } catch (error) {
      error.message ? console.log(error.message) : console.log(error);
    }
  };
  return (
    <div className="bottom-0 absolute flex justify-between items-center bg-[#2a2b33] px-10 w-full">
      <div className="flex justify-center items-center gap-3">
        <div className="relative w-12 h-12">
          <Avatar className="rounded-full w-12 h-12 overflow-hidden">
            {image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                className="bg-black rounded-full w-12 h-12 object-cover"
              />
            ) : (
              <AvatarFallback
                className={`flex justify-center items-center border-[1px] rounded-full w-12 h-12  text-lg uppercase ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.userName && userInfo.lastName
            ? `${userInfo.userName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="font-medium text-purple-500 text-xl"
                onClick={() => {
                  navigate("/profile");
                }}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] bg-none text-white">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                className="font-medium text-red-500 text-xl"
                onClick={() => {
                  LogOut();
                }}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] bg-none text-white">
              Log Out
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
