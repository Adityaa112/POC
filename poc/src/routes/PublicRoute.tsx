import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export default function PublicRoute() {
  const accessToken = useAuthStore((state) => state.getAccessToken());

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
