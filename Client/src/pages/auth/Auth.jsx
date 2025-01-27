import Background from "../../assets/login2.png";
import Victory from "../../assets/victory.svg";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "../../lib/api-client.js";
import { SIGNUP_ROUTE } from "@/utils/constant.js";
import { SIGNIN_ROUTE } from "@/utils/constant.js";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
  const { setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conform, setConform] = useState("");
  const validaSignup = () => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!re.test(email)) {
      return false;
    }
    if (!password.length) {
      toast.error("please enter the password");
      return false;
    }
    if (!password === conform) {
      toast.error("make sure the confirm password and the password are same");
      return false;
    }
    return true;
  };
  const validaSignIn = () => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!re.test(email)) {
      return false;
    }
    if (!password.length) {
      toast.error("please enter the password");
      return false;
    }
    return true;
  };

  const handleSingIn = async () => {
    if (validaSignIn()) {
      try {
        const response = await apiClient.post(
          SIGNIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );

        console.log(response.data);
        toast.success("User logged in successfully");
        setUserInfo(response.data.user);
        if (response.data.user.profileSetup === true) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      } catch (error) {
        console.log("i am in error block");
        console.log(error);
        console.error(
          error.response?.data || "Error occurred at the login page"
        );
        error.response.data.message
          ? toast.error(error.response.data.message)
          : toast.error("Login Failed");
      }
    }
  };
  const handleSingUp = async () => {
    if (validaSignup()) {
      try {
        const response = await apiClient.post(SIGNUP_ROUTE, {
          email,
          password,
        });
        console.log(response);
        toast.success("success", "User created successfully");
        if (response.status === 201) {
          setUserInfo(response.data.user);
          navigate("/profile");
        }
      } catch (error) {
        console.error(
          error.message
            ? error.message
            : console.log("Error has ocurred at the signup page")
        );
        toast.error("failure", "User created successfully");
      }
    }
    return false;
  };

  return (
    <div className="flex justify-center items-center w-[100vw] h-[100vh] overflow-hidden">
      <div className="border-2 border-white grid xl:grid-cols-2 bg-white shadow-2xl rounded-3xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] h-[80vh] text-opacity-95 overflow-hidden">
        {" "}
        <div className="flex flex-col justify-center items-center gap-10">
          <div className="flex flex-col justify-center items-center">
            <div className="flex justify-center items-center">
              <h1 className="font-bold text-5xl lg:text-6xl">Welcome</h1>
              <img
                src={Victory}
                alt="Victory Emoji"
                className="h-[80px] lg:h-[100px]"
              />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app
            </p>
          </div>
          <div className="flex justify-center items-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent p-3 border-b-2 data-[state=active]:border-b-purple-500 rounded-none w-full data-[state=active]:font-semibold text-black data-[state=active]:text-black text-opacity-90 transition-all duration-300"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent p-3 border-b-2 data-[state=active]:border-b-purple-500 rounded-none w-full data-[state=active]:font-semibold text-black data-[state=active]:text-black text-opacity-90 transition-all duration-300"
                >
                  SignUp
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="flex flex-col gap-5 mt-10">
                <Input
                  placeholder="email"
                  type="email"
                  className="p-6 rounded-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="password"
                  type="password"
                  className="p-6 rounded-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="p-6 rounded-full w-full"
                  onClick={handleSingIn}
                >
                  Login
                </Button>
              </TabsContent>

              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  placeholder="email"
                  type="email"
                  className="p-6 rounded-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="password"
                  type="password"
                  className="p-6 rounded-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="conform password"
                  type="password"
                  className="p-6 rounded-full"
                  value={conform}
                  onChange={(e) => setConform(e.target.value)}
                />
                <Button
                  className="p-6 rounded-full w-full"
                  onClick={handleSingUp}
                >
                  Sign Up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="xl:flex justify-center items-center hidden h-full overflow-hidden">
          <img
            src={Background}
            alt="Background Image"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
