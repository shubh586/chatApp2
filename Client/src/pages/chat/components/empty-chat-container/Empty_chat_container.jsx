import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";

const Empty_chat_container = () => {
  return (
    <div className="md:flex flex-col flex-1 justify-center items-center hidden md:bg-[#1c1d25] transition-all duration-100">
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOptions}
      />
      <div className="flex flex-col justify-center items-center gap-5 mt-10 text-3xl text-white lg:text-4xl text-opacity-80 transition-all duration-300">
        <h3 className="roboto-medium">
          Hi<span className="text-purple-500">!</span> Welocme to
          <span className="text-purple-500">BackChori APP</span>
          Chat App<span className="text-purple-500"></span>
        </h3>
      </div>
    </div>
  );
};

export default Empty_chat_container;
