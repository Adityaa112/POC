import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/api/auth.api";
import { useAuthStore } from "@/store/useAuthStore";

export default function Dashboard() {
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      logout();
      navigate("/login", { replace: true });
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-blue-100 bg-white px-8 py-10 text-center shadow-xl shadow-blue-200/50">
        <h1 className="mb-2 text-2xl font-bold text-blue-900">OmneNest Dashboard</h1>
        <p className="mb-8 text-blue-700">Welcome back. You are logged in successfully.</p>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
