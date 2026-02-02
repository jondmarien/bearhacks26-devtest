import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Logger from "@/utils/Logger";
import GlowBackground from "@/components/layout/GlowBackground";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

const AdminLoginPage: React.FC = () => {
  const { user, loginWithPassword } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const timestamp = localStorage.getItem("adminAuthTimestamp");
    if (user?.role === "admin" && timestamp) {
      const diff = Date.now() - parseInt(timestamp);
      if (diff < 30 * 60 * 1000) {
        Logger.info("Admin session valid, auto-redirecting to dashboard");
        navigate("/admin/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      await loginWithPassword(username, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please attempt again.");
      Logger.error("Admin login failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative overflow-hidden">
      <Navbar />
      <GlowBackground color="purple" position="both" />

      <div className="flex-1 flex flex-col items-center justify-center p-6 pt-20 relative">
        <AdminLoginForm
          onSubmit={handleLogin}
          error={error}
          loading={loading}
        />

        <p className="mt-8 text-gray-500 text-xs font-black uppercase tracking-[0.3em] opacity-50 select-none">
          SYSTEM.ADMIN.PROMPT // SECURE_SHELL
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
