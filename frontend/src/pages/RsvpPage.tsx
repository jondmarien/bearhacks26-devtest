import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Logger from "@/utils/Logger";

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

  const fetchRsvp = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (user?.role === "admin") {
        // If admin, we already have apps list below, but we need to refresh list to see RSVP status
        // OR we just use fetchAdminApps to refresh everything.
        // Let's just re-fetch list.
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
      // Refresh status
      if (user?.role === "admin") {
        await fetchAdminApps();
      } else {
        fetchRsvp();
      }
    } catch (err) {
      alert("Failed to RSVP. Ensure you are accepted.");
    }
  };

  if (authLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (loading)
    return <div className="p-8 text-white">Checking Eligibility...</div>;

  // DERIVE STATUS FOR ADMIN FROM SELECTED APP
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

  // If admin has no apps, show empty state
  if (user.role === "admin" && adminApps.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col relative">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-24">
          <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
            <h2 className="text-xl mb-4">No Test Applications</h2>
            <button
              onClick={() => navigate("/app/apply")}
              className="text-blue-400 font-bold"
            >
              Create One &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-24">
        {user.role === "admin" && (
          <div className="mb-8 w-full max-w-md bg-gray-800 p-4 rounded-xl border border-gray-700">
            <label className="block text-sm font-bold text-gray-400 mb-2">
              Select Test Application
            </label>
            <select
              className="w-full bg-gray-700 p-2 rounded text-white outline-none border border-gray-600"
              value={selectedAppId || ""}
              onChange={(e) => setSelectedAppId(e.target.value)}
            >
              {adminApps.map((app) => (
                <option key={app._id} value={app._id}>
                  {app.basicInfo.fullName} -{" "}
                  {new Date(app.createdAt).toLocaleTimeString()}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
          <h1 className="text-3xl font-bold mb-6">RSVP Status</h1>

          {!effectiveStatus.hasApplication && (
            <div className="space-y-4">
              <p className="text-gray-400">You haven't applied yet!</p>
              <button
                onClick={() => navigate("/app/apply")}
                className="px-6 py-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-500 w-full"
              >
                Go to Application
              </button>
            </div>
          )}

          {effectiveStatus.hasApplication && !effectiveStatus.accepted && (
            <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg text-yellow-200">
              Are you ready? Your application is <strong>under review</strong>.{" "}
              <br />
              We will email you once a decision has been made!
            </div>
          )}

          {effectiveStatus.hasApplication &&
            effectiveStatus.accepted &&
            !effectiveStatus.rsvpd && (
              <div className="space-y-4">
                <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-200 mb-6">
                  Congratulations! You've been accepted to BearHacks 2026! 🎉
                </div>
                <button
                  onClick={handleRsvp}
                  className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-white shadow-lg animate-pulse"
                >
                  CONFIRM MY ATTENDANCE
                </button>
              </div>
            )}

          {effectiveStatus.rsvpd && (
            <div className="space-y-6">
              <div className="text-6xl">🎟️</div>
              <h2 className="text-2xl font-bold text-green-400">
                You are going!
              </h2>
              <p className="text-gray-300">
                Your spot is confirmed. We can't wait to see you there!
              </p>
              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-500">
                  Check your email for further instructions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RsvpPage;
