import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Logger from "@/utils/Logger";

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, loginWithPassword } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  React.useEffect(() => {
    const timestamp = localStorage.getItem("adminAuthTimestamp");
    if (user?.role === "admin" && timestamp) {
      const diff = Date.now() - parseInt(timestamp);
      if (diff < 30 * 60 * 1000) {
        Logger.info("Admin session valid, auto-redirecting to dashboard");
        navigate("/admin/dashboard", { replace: true });
      } else {
        Logger.warn("Admin session expired or invalid timestamp");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithPassword(username, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-sm w-full border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          {error && (
            <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded font-bold transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
