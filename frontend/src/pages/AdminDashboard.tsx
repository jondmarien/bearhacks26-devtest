import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Logger from "@/utils/Logger";
import type { Application, TestApplication } from "@/types/admin";
import ApplicationReviewModal from "@/components/admin/ApplicationReviewModal";
import ApplicationTable from "@/components/admin/ApplicationTable";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AdminDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"hackers" | "test">("hackers");
  const [applications, setApplications] = useState<Application[]>([]);
  const [testApps, setTestApps] = useState<TestApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<
    Application | TestApplication | null
  >(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };

      const [hackerRes, testRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/applications`, config),
        axios.get(`${API_URL}/api/admin/my-apps`, config),
      ]);

      setApplications(hackerRes.data);
      setTestApps(testRes.data);
    } catch (error) {
      Logger.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAdminSession = () => {
      const timestamp = localStorage.getItem("adminAuthTimestamp");
      if (!timestamp) {
        Logger.warn("No admin session timestamp found, redirecting to login");
        navigate("/admin", { replace: true });
        return;
      }

      const diff = Date.now() - parseInt(timestamp);
      if (diff > 30 * 60 * 1000) {
        Logger.warn("Admin session timed out (30m), forcing re-login");
        localStorage.removeItem("adminAuthTimestamp");
        navigate("/admin", { replace: true });
      } else {
        Logger.debug(
          `Admin session active: ${Math.round((30 * 60 * 1000 - diff) / 60000)} minutes remaining`,
        );
      }
    };

    if (user?.role === "admin") {
      checkAdminSession();
      fetchData();
    }
  }, [user, navigate]);

  const updateStatus = async (
    id: string,
    status: "accepted" | "rejected",
    isTest: boolean,
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      const endpoint = isTest
        ? `${API_URL}/api/admin/test-application/${id}/status`
        : `${API_URL}/api/admin/application/${id}/status`;

      await axios.post(
        endpoint,
        { status },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      );

      // Optimistic update
      const accepted = status === "accepted";
      if (isTest) {
        setTestApps((prev) =>
          prev.map((app) => (app._id === id ? { ...app, accepted } : app)),
        );
      } else {
        setApplications((prev) =>
          prev.map((app) => (app._id === id ? { ...app, accepted } : app)),
        );
      }

      // Update selected app if open
      if (selectedApp?._id === id) {
        setSelectedApp((prev) => (prev ? { ...prev, accepted } : null));
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (authLoading)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  if (!user || user.role !== "admin") return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative">
      <Navbar />
      <div className="flex-1 p-8 pt-24 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
            Admin Dashboard
          </h1>
          <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
            <button
              onClick={() => setActiveTab("hackers")}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === "hackers" ? "bg-purple-600 shadow-lg" : "hover:bg-gray-700 text-gray-400"}`}
            >
              Hacker Apps
            </button>
            <button
              onClick={() => setActiveTab("test")}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === "test" ? "bg-purple-600 shadow-lg" : "hover:bg-gray-700 text-gray-400"}`}
            >
              Test Apps
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 animate-pulse font-medium">
              Loading Database...
            </p>
          </div>
        ) : (
          <ApplicationTable
            applications={activeTab === "hackers" ? applications : testApps}
            activeTab={activeTab}
            onSelectApp={setSelectedApp}
            updateStatus={updateStatus}
          />
        )}
      </div>

      {/* Modal */}
      {selectedApp && (
        <ApplicationReviewModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          updateStatus={updateStatus}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
