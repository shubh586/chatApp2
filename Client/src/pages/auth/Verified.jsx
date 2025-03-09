import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_USER_INFO } from "@/utils/constant";

const Verified = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();

  useEffect(() => {
    const fetchUserinfo = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        if (response.data.user) {
          setUserInfo(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        toast.error("Failed to fetch user information.");
      }
    };

    if (status === "success") {
      fetchUserinfo();
      toast.success("Email verified successfully!");
      navigate("/profile");
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Email Verified Successfully!</h1>
        <p className="text-lg mb-8">Redirecting to your profile...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    </div>
  );
};

export default Verified;