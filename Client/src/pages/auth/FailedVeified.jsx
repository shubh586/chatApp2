import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const FailedVerified = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const navigate = useNavigate();

  useEffect(() => {
    switch (status) {
      case "user-not-found":
        toast.error("User not found. Please sign up.");
        break;
      case "already-verified":
        toast.error("Your email is already verified. Please login.");
        break;
      case "token-expired":
        toast.error("Verification link has expired. Please request a new one.");
        break;
      case "invalid-token":
        toast.error("Invalid verification link. Please try again.");
        break;
      default:
        toast.error("An error occurred. Please try again later.");
        break;
    }
    navigate("/auth");
  }, [ status]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Email Verification Failed</h1>
        <p className="text-lg mb-8">Redirecting to the login page...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    </div>
  );
};

export default FailedVerified;