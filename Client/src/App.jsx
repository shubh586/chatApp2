/* eslint-disable react/prop-types */
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Chat from "./pages/chat/Chat";
import Profile from "./pages/profile/Profile";
import { useAppStore } from "./store";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constant.js";
import { useEffect, useState } from "react";

import Verified from "./pages/auth/Verified";
import FailedVerified from "./pages/auth/FailedVeified";
const Authenticated = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  if (isAuthenticated) {
    if(userInfo.isVerified){
      return userInfo.profileSetup ? (
        <Navigate to="/chat" replace />
      ) : (
        <Navigate to="/profile" replace />
      );
    }
  }
  return children;
};
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;

  if (isAuthenticated) {
    if(userInfo.isVerified){
      return children
    }
  }
  return <Navigate to="/auth" replace />;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const { userInfo, setUserInfo } = useAppStore();

  useEffect(() => {
    const fetchUserinfo = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        console.log("printing the respose data ", response.data.user);

        setUserInfo(response.data.user);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      fetchUserinfo();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <Authenticated>
              <Auth />
            </Authenticated>
          }
        />
          <Route path="/verify-success" element={<Verified/>} />
          <Route path="/verify-error" element={<FailedVerified/>} />
    
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
