import { AmplifyChatbot } from "@aws-amplify/ui-react/legacy";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import Fab from "@mui/material/Fab";
import { Amplify } from "aws-amplify";
import React, { useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Navbar } from "../components";
import {
  CipherVerification,
  Home,
  HotelBooking,
  Login,
  QuestionVerification,
  RoomList,
  SignupSteps
} from "../pages";

Amplify.configure({
  Auth: {
    identityPoolId: "us-east-1:466de39b-520b-4df9-af4b-72a7d70019ee", // (required) Identity Pool ID
    region: "us-east-1", // (required) Identity Pool region
  },
  Interactions: {
    bots: {
      RoomBookingTrial: {
        name: "RoomBookingTrial",
        alias: "devTrial",
        region: "us-east-1",
      },
    },
  },
});

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<WithoutNavbar />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupSteps />} />
        <Route path="/questionverification" element={<QuestionVerification />} >
          <Route path = ":Username" element={<QuestionVerification />} />
        </Route>
        <Route path="/cipherVerification/:cipherKey" element={<CipherVerification />} />
      </Route>
      <Route element={<WithNavbar />}>
        <Route path="/hotel" element={<HotelBooking />} />
        <Route path="/rooms" element={<RoomList />} />
      </Route>
      <Route
        path="*"
        element={
          <RequireAuth>
            <ProtectedRoutes />
          </RequireAuth>
        }
      />
    </Routes>
  );
};

const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route element={<WithNavbar />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
};

const RequireAuth = ({ children }) => {
  // const { isLogin } = useAuth();
  const isLogin = false;

  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const WithNavbar = () => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <Navbar />
      <div>
        <Fab
          color="primary"
          aria-label="add"
          className="chatButton"
          onClick={() => setShow((prev) => !prev)}
        >
          <ChatOutlinedIcon />
        </Fab>
        {show && (
          <AmplifyChatbot
            botName="RoomBookingTrial"
            botTitle="B &amp; B Assistant Support"
            welcomeMessage="How can I help you?"
          />
        )}
      </div>

      <Outlet />
    </div>
  );
};

const WithoutNavbar = () => <Outlet />;

export default AppRoutes;
