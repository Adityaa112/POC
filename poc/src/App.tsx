import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import ForgetPassword from "./pages/ForgotCredentials/ForgetPassword/ForgetPassword";
import ForgetUserId from "./pages/ForgotCredentials/ForgetUserId";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes: Login, Signup, etc. */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/forget-user-id" element={<ForgetUserId />} />
        </Route>

        {/* Protected Routes: Dashboard, Portfolio, Funds */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more private routes here */}
        </Route>

        {/* Redirect empty path to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
