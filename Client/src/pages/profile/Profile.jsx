import { useAppStore } from "@/store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaPlus, FaTrash } from "react-icons/fa";
import { getColor } from "@/lib/utils";
import { colors } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { UPDATE_USER_ROUTE } from "@/utils/constant";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectColor, setSelectColor] = useState(userInfo.color);

  const saveChanges = async (e) => {
    try {
      e.preventDefault();
      const response = await apiClient.patch(UPDATE_USER_ROUTE, {
        userName: firstName || userInfo.userName,
        lastName: lastName || userInfo.lastName,
        image: image || userInfo.image,
        color: selectColor || userInfo.color,
      });
      const user = response.data.user;
      console.log("updated data", response.data.user);
      setUserInfo(user);
      toast.success("Profile updates sucessfully");
      navigate("/chat");
    } catch (error) {
      console(error);
    }
  };
  const handlenavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please set the profile first");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-10 bg-[#1b1c24] h-[100vh]">
      <div className="flex flex-col gap-10 w-[80vh] md:w-max">
        <IoArrowBack
          className="text-4xl text-white/90 lg:text-6xl cursor-pointer"
          onClick={handlenavigate}
        />
        <div className="grid grid-cols-2">
          <div
            className="relative flex justify-center items-center w-32 md:w-48 h-full md:h-48"
            onMouseEnter={() => {
              setHovered(true);
            }}
            onMouseLeave={() => {
              setHovered(false);
            }}
          >
            <Avatar className="rounded-full w-32 md:w-48 h-32 md:h-48 overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  className="bg-black w-full h-full object-cover"
                />
              ) : (
                <AvatarFallback
                  className={`flex justify-center items-center border-[1px] rounded-full w-32 h-32 md:h-48 md:w-48 text-5xl uppercase ${getColor(
                    selectColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </AvatarFallback>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex justify-center items-center bg-black/50 rounded-full ring-fuchsia-50">
                {image ? (
                  <FaTrash className="text-3xl text-white cursor-pointer" />
                ) : (
                  <FaPlus className="text-3xl text-white cursor-pointer" />
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center items-center gap-10 min-w-32 md:min-w-64 text-white">
            <div className="w-full">
              <Input
                placeholder="Email"
                disabled
                type="email"
                value={userInfo.email}
                className="bg-[#2c2e3b] p-6 border-none rounded-lg"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="FirstName"
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                value={firstName || userInfo.userName}
                className="bg-[#2c2e3b] p-6 border-none rounded-lg"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="LastName"
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                value={lastName || userInfo.lastName}
                className="bg-[#2c2e3b] p-6 border-none rounded-lg"
              />
            </div>
            <div className="flex justify-between items-center gap-5 pr-2 pl-2 w-full">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`rounded-full h-8 w-8 ${color} cursor-pointer transition-all duration-300 ${
                    selectColor === index
                      ? "outline-white outline outline-2"
                      : ""
                  }`}
                  onClick={() => setSelectColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full">
          <button
            className="bg-purple-700 hover:bg-purple-900 w-full h-16 text-white transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
