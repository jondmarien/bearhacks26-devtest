import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Logger from "@/utils/Logger";
import AdminAppSelector from "@/components/rsvp/AdminAppSelector";
import RsvpStatusCard from "@/components/rsvp/RsvpStatusCard";
import LoadingScreen from "@/components/layout/LoadingScreen";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface AdminApp {
  _id: string;
  basicInfo: { fullName: string };
  accepted: boolean;
  rsvpd: boolean;
  createdAt: string;
}

const RsvpPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Normal State
  const [status, setStatus] = useState({
    hasApplication: false,
    accepted: false,
    rsvpd: false,
  });

  // Admin State
  const [adminApps, setAdminApps] = useState<AdminApp[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const fetchAdminApps = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/api/admin/my-apps`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setAdminApps(res.data);
      if (res.data.length > 0 && !selectedAppId) {
        setSelectedAppId(res.data[0]._id);
      }
    } catch (err) {
      Logger.error("Failed to load admin apps", err);
    }
  };

  const fetchRsvp = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (user?.role === "admin") {
        await fetchAdminApps();
      } else {
        const res = await axios.get(`${API_URL}/api/rsvp/me`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setStatus(res.data);
      }
    } catch (err) {
      Logger.error("Failed to load RSVP status", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        fetchAdminApps().finally(() => setLoading(false));
      } else {
        fetchRsvp();
      }
    }
  }, [user]);

  const handleRsvp = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${API_URL}/api/rsvp`,
        user?.role === "admin" ? { applicationId: selectedAppId } : {},
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      if (user?.role === "admin") {
        await fetchAdminApps();
      } else {
        fetchRsvp();
      }
    } catch (err) {
      alert("Failed to RSVP. Ensure you are accepted.");
    }
  };

  if (authLoading) return <LoadingScreen message="Checking Credentials..." />;
  if (!user) return <Navigate to="/" replace />;

  if (loading) return <LoadingScreen message="Checking Eligibility..." />;

  const currentApp =
    user.role === "admin"
      ? adminApps.find((a) => a._id === selectedAppId)
      : null;

  const effectiveStatus =
    user.role === "admin" && currentApp
      ? {
          hasApplication: true,
          accepted: currentApp.accepted,
          rsvpd: currentApp.rsvpd,
        }
      : status;

  if (user.role === "admin" && adminApps.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col relative font-primary">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-24">
          <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
            <h2 className="text-xl font-bold mb-4">No Test Applications</h2>
            <p className="text-gray-400 mb-6 font-medium">
              You need an application to test the RSVP flow.
            </p>
            <button
              onClick={() => navigate("/app/apply")}
              className="px-6 py-2 bg-purple-600 rounded-xl font-bold hover:bg-purple-500 transition-all shadow-lg"
            >
              Create One &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative font-primary">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 pt-24">
        {user.role === "admin" && (
          <AdminAppSelector
            apps={adminApps}
            selectedId={selectedAppId}
            onSelect={setSelectedAppId}
          />
        )}

        <RsvpStatusCard status={effectiveStatus} onRsvp={handleRsvp} />
      </div>
    </div>
  );
};

export default RsvpPage;
