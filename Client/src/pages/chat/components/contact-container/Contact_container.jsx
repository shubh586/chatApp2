/* eslint react/prop-types: 0 */
import {GET_CONTACTS} from "@/utils/constant.js";
import { useEffect } from "react";
import NewDm from "./components/newdm/NewDm";
import ProfileInfo from "./components/profile-info/ProfileInfo";
import { useAppStore } from "@/store";
import ContactList from "@/components/ContactList";
import { apiClient } from "@/lib/api-client";

const Contact_container = () => {
const {setDirectMessagesContacts,directMessagesContacts}=useAppStore();

useEffect(() => { 

  const getContcts=async()=>{
    console.log("fetching contacts");
    try {
      const response = await apiClient.post(GET_CONTACTS, { withCredentials: true });
      if(response.data.contacts){
        setDirectMessagesContacts(response.data.contacts);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };
  getContcts();
},[])

  return (
    <div className="relative border-[#2f303b] bg-[#1b1c24] border-r-2 w-full md:w-[35vw] lg:w-[30vw] xl:w-[20vw] active">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-4">
        <div className="flex justify-between items-center pr-10">
          <Title text="Direct Mesages" />
          <NewDm />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-4">
        <div className="flex justify-start items-center pr-10">
          <Title text="Channels" />
        </div>
      </div>
      <div>
        <ProfileInfo />
      </div>
    </div>
  );
};

export default Contact_container;

const Logo = () => {
  return (
    <div className="flex justify-start items-center gap-2 p-5">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="font-semibold text-3xl">Syncronus</span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="pl-10 font-light text-neutral-400 text-sm text-opacity-90 uppercase tracking-widest">
      {text}
    </h6>
  );
};
