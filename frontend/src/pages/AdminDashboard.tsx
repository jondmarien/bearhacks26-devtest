import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Logger from "@/utils/Logger";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface Application {
  _id: string;
  userId: {
    username: string;
    email: string;
    avatar: string;
    discordId: string;
  };
  basicInfo: {
    fullName: string;
    school: string;
    year: string;
  };
  accepted: boolean;
  rsvpd: boolean;
}

interface TestApplication {
  _id: string;
  basicInfo: {
    fullName: string;
    school: string;
    year: string;
  };
  accepted: boolean;
  rsvpd: boolean;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"hackers" | "test">("hackers");
  const [applications, setApplications] = useState<Application[]>([]);
  const [testApps, setTestApps] = useState<TestApplication[]>([]);
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
    if (user?.role === "admin") {
      fetchData();
    }
  }, [user]);

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
          <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 ring-1 ring-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-750/50 text-gray-400 uppercase text-xs font-black tracking-widest border-b border-gray-700">
                  <tr>
                    <th className="p-5">
                      {activeTab === "hackers" ? "User" : "Test Subject"}
                    </th>
                    <th className="p-5">School Info</th>
                    <th className="p-5">Decision</th>
                    <th className="p-5">RSVP Status</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {(activeTab === "hackers" ? applications : testApps).map(
                    (app: any) => (
                      <tr
                        key={app._id}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            {activeTab === "hackers" ? (
                              <>
                                <img
                                  src={`https://cdn.discordapp.com/avatars/${app.userId.discordId}/${app.userId.avatar}.png`}
                                  alt="avatar"
                                  className="w-10 h-10 rounded-xl bg-gray-700 border border-gray-600 shadow-inner"
                                  onError={(e) =>
                                    (e.currentTarget.src = `https://ui-avatars.com/api/?name=${app.userId.username}&background=random`)
                                  }
                                />
                                <div>
                                  <div className="font-bold text-white group-hover:text-purple-300 transition-colors">
                                    {app.basicInfo.fullName}
                                  </div>
                                  <div className="text-xs text-gray-500 font-mono">
                                    {app.userId.email}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div>
                                <div className="font-bold text-white group-hover:text-purple-300 transition-colors">
                                  {app.basicInfo.fullName}
                                </div>
                                <div className="text-[10px] text-gray-500 font-mono mt-1">
                                  ID: {app._id.slice(-8)}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="text-sm font-medium text-gray-300">
                            {app.basicInfo.school}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            Class of {app.basicInfo.year}
                          </div>
                        </td>
                        <td className="p-5">
                          {app.accepted ? (
                            <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-[10px] font-black border border-green-500/20 tracking-wider">
                              ACCEPTED
                            </span>
                          ) : (
                            <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-[10px] font-black border border-yellow-500/20 tracking-wider">
                              PENDING
                            </span>
                          )}
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${app.rsvpd ? "bg-green-500 animate-pulse" : "bg-gray-600"}`}
                            ></div>
                            <span
                              className={`text-sm font-bold ${app.rsvpd ? "text-green-400" : "text-gray-500"}`}
                            >
                              {app.rsvpd ? "Confirmed" : "Waiting"}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-2">
                            {!app.accepted ? (
                              <button
                                onClick={() =>
                                  updateStatus(
                                    app._id,
                                    "accepted",
                                    activeTab === "test",
                                  )
                                }
                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs font-black transition-all shadow-lg active:scale-95 border border-blue-400/20"
                              >
                                Accept
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  updateStatus(
                                    app._id,
                                    "rejected",
                                    activeTab === "test",
                                  )
                                }
                                className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs font-black transition-all shadow-lg active:scale-95 border border-red-400/20"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
              {(activeTab === "hackers" ? applications : testApps).length ===
                0 && (
                <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
                  <div className="p-4 bg-gray-700/50 rounded-full">
                    <svg
                      className="w-12 h-12 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-400">
                      No {activeTab} apps found
                    </p>
                    <p className="text-sm text-gray-500">
                      Everything is quiet for now...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
