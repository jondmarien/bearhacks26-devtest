import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
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
    preferredName?: string;
    school: string;
    year: string;
    location?: string;
  };
  skillsAndLinks: {
    skills: string[];
    githubUrl?: string;
    portfolioUrl?: string;
    otherLinks?: string[];
  };
  accessibility: {
    allergies?: string;
    dietaryRestrictions?: string;
    accommodations?: string;
  };
  accepted: boolean;
  rsvpd: boolean;
}

interface TestApplication {
  _id: string;
  basicInfo: {
    fullName: string;
    preferredName?: string;
    school: string;
    year: string;
    location?: string;
  };
  skillsAndLinks: {
    skills: string[];
    githubUrl?: string;
    portfolioUrl?: string;
    otherLinks?: string[];
  };
  accessibility: {
    allergies?: string;
    dietaryRestrictions?: string;
    accommodations?: string;
  };
  accepted: boolean;
  rsvpd: boolean;
  createdAt: string;
}

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

  const ApplicationReviewModal = ({
    app,
    onClose,
  }: {
    app: Application | TestApplication;
    onClose: () => void;
  }) => {
    const isHacker = "userId" in app;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-gray-900 w-full max-w-2xl border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-6 border-b border-gray-800 flex justify-between items-start bg-gray-900/50">
            <div className="flex items-center gap-4">
              {isHacker && (
                <img
                  src={`https://cdn.discordapp.com/avatars/${app.userId.discordId}/${app.userId.avatar}.png`}
                  alt="avatar"
                  className="w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 shadow-xl"
                  onError={(e) =>
                    (e.currentTarget.src = `https://ui-avatars.com/api/?name=${app.userId.username}&background=random`)
                  }
                />
              )}
              <div>
                <h2 className="text-2xl font-black text-white">
                  {app.basicInfo.fullName}
                </h2>
                <p className="text-gray-400 font-medium">
                  {isHacker
                    ? app.userId.email
                    : `Test Subject #${app._id.slice(-6)}`}
                </p>
                {app.basicInfo.preferredName && (
                  <p className="text-xs text-purple-400 font-bold mt-1 uppercase tracking-tighter">
                    Prefers: {app.basicInfo.preferredName}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-500 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  School
                </label>
                <p className="text-gray-200 font-bold">
                  {app.basicInfo.school}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Graduation
                </label>
                <p className="text-gray-200 font-bold">
                  Class of {app.basicInfo.year}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Location
                </label>
                <p className="text-gray-200 font-bold">
                  {app.basicInfo.location || "Remote / Not Specified"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Discord
                </label>
                <p className="text-gray-200 font-bold">
                  {isHacker ? app.userId.username : "N/A"}
                </p>
              </div>
            </div>

            <hr className="border-gray-800" />

            {/* Skills & Experience */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-500 rounded-full"></span>
                Skills & Experience
              </h3>
              <div className="flex flex-wrap gap-2">
                {app.skillsAndLinks.skills.length > 0 ? (
                  app.skillsAndLinks.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg font-bold"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm italic">
                    No skills listed
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 mt-4">
                {app.skillsAndLinks.githubUrl && (
                  <a
                    href={app.skillsAndLinks.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-950 rounded-lg text-white">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white truncate">
                      {app.skillsAndLinks.githubUrl}
                    </span>
                  </a>
                )}
                {app.skillsAndLinks.portfolioUrl && (
                  <a
                    href={app.skillsAndLinks.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-950 rounded-lg text-white">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white truncate">
                      {app.skillsAndLinks.portfolioUrl}
                    </span>
                  </a>
                )}
              </div>
            </div>

            <hr className="border-gray-800" />

            {/* Accessibility */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
                Needs & Logistics
              </h3>
              <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-4">
                <div>
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">
                    Dietary Restrictions
                  </label>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {app.accessibility.dietaryRestrictions || "None"}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">
                    Allergies
                  </label>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {app.accessibility.allergies || "None"}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">
                    Accommodations
                  </label>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {app.accessibility.accommodations || "None"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-gray-950/50 border-t border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest ${app.accepted ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"}`}
              >
                {app.accepted ? "ACCEPTED" : "PENDING REVIEW"}
              </span>
              {app.rsvpd && (
                <span className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-xs font-black border border-blue-500/20 tracking-widest">
                  RSVPED
                </span>
              )}
            </div>
            <div className="flex gap-3">
              {!app.accepted ? (
                <button
                  onClick={() => updateStatus(app._id, "accepted", !isHacker)}
                  className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 border border-green-400/20"
                >
                  Accept Applicant
                </button>
              ) : (
                <button
                  onClick={() => updateStatus(app._id, "rejected", !isHacker)}
                  className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 border border-red-400/20"
                >
                  Revoke Acceptance
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
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
                        className="hover:bg-white/5 transition-colors group cursor-pointer"
                        onClick={() => setSelectedApp(app)}
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
                                  <div className="text-xs text-gray-500 font-mono text-nowrap">
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
                        <td className="p-5 text-nowrap">
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatus(
                                    app._id,
                                    "accepted",
                                    activeTab === "test",
                                  );
                                }}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs font-black transition-all shadow-lg active:scale-95 border border-blue-400/20"
                              >
                                Accept
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatus(
                                    app._id,
                                    "rejected",
                                    activeTab === "test",
                                  );
                                }}
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

      {/* Modal */}
      {selectedApp && (
        <ApplicationReviewModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
