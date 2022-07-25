import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Navbar } from '../components';
import {
  Home,
  Login,
  SignupSteps,
  HotelBooking,
  RoomList,
  Kitchen,
  MealList,
  CipherVerification,
  QuestionVerification,
  Feedback,
  Tour,
  Profile,
  Admin,
  UserFeedback,
  Dashboard,
} from '../pages';
import { AmplifyChatbot } from '@aws-amplify/ui-react/legacy';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import Fab from '@mui/material/Fab';
import { Amplify, Auth, Interactions } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context';
import { getUserName } from '../local-storage/index';

Amplify.configure({
  Auth: {
    identityPoolId: 'us-east-1:466de39b-520b-4df9-af4b-72a7d70019ee', // (required) Identity Pool ID
    region: 'us-east-1', // (required) Identity Pool region
  },
  Interactions: {
    bots: {
      RoomBookingTrial: {
        name: 'RoomBookingTrial',
        alias: 'devTrial',
        region: 'us-east-1',
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
        <Route path="/questionverification" element={<QuestionVerification />}>
          <Route path=":Username" element={<QuestionVerification />} />
        </Route>
        <Route
          path="/cipherVerification/:cipherKey"
          element={<CipherVerification />}
        />
      </Route>
      <Route element={<WithNavbar />}>
        <Route path="/hotel" element={<HotelBooking />} />
        <Route path="/hotel/rooms" element={<RoomList />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/kitchen/meals" element={<MealList />} />
        <Route path="/review" element={<Feedback />} />
        <Route path="/tour" element={<Tour />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
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
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user-feedback" element={<UserFeedback />} />
      </Route>
    </Routes>
  );
};

const RequireAuth = ({ children }) => {
  const { loggedInUser } = useAuth();

  if (!loggedInUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const WithNavbar = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    Auth.configure({
      identityPoolId: 'us-east-1:466de39b-520b-4df9-af4b-72a7d70019ee', // (required) Identity Pool ID
      region: 'us-east-1', // (required) Identity Pool region
    });
    console.log(getUserName());
    Interactions.send('RoomBookingTrial', 'my userid is ' + getUserName())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
            welcomeMessage="Hi, how can I help you? If you want to know some helpful commands to get your answers faster. Type 'help'."
          />
        )}
      </div>

      <Outlet />
    </div>
  );
};

const WithoutNavbar = () => <Outlet />;

export default AppRoutes;
