import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Navbar } from '../components';
import { Home, Login, SignupSteps, HotelBooking, RoomList } from '../pages';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<WithoutNavbar />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupSteps />} />
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
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const WithoutNavbar = () => <Outlet />;

export default AppRoutes;
