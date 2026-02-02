import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const RsvpPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({
    hasApplication: false,
    accepted: false,
    rsvpd: false,
  });

  const fetchRsvp = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/api/rsvp/me`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setStatus(res.data);
    } catch (err) {
      console.error("Failed to load RSVP status", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchRsvp();
  }, [user]);

  const handleRsvp = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${API_URL}/api/rsvp`,
        {},
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      fetchRsvp();
    } catch (err) {
      alert("Failed to RSVP. Ensure you are accepted.");
    }
  };

  if (authLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (loading)
    return <div className="p-8 text-white">Checking Eligibility...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
        <h1 className="text-3xl font-bold mb-6">RSVP Status</h1>

        {!status.hasApplication && (
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

        {status.hasApplication && !status.accepted && (
          <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg text-yellow-200">
            Are you ready? Your application is <strong>under review</strong>.{" "}
            <br />
            We will email you once a decision has been made!
          </div>
        )}

        {status.hasApplication && status.accepted && !status.rsvpd && (
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

        {status.rsvpd && (
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
  );
};

export default RsvpPage;
