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

const AdminDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchApps = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${API_URL}/api/admin/applications`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setApplications(res.data);
      } catch (error) {
        Logger.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [user]);

  const updateStatus = async (id: string, status: "accepted" | "rejected") => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${API_URL}/api/admin/application/${id}/status`,
        { status },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      );
      // Optimistic update
      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, accepted: status === "accepted" } : app,
        ),
      );
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (authLoading) return <div>Loading...</div>;
  if (!user || user.role !== "admin") return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative">
      <Navbar />
      <div className="flex-1 p-8 pt-24 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {loading ? (
          <div>Loading Applications...</div>
        ) : (
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-700 text-gray-300">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">School</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">RSVP</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-750">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://cdn.discordapp.com/avatars/${app.userId.discordId}/${app.userId.avatar}.png`}
                            alt="avatar"
                            className="w-8 h-8 rounded-full bg-gray-600"
                            onError={(e) =>
                              (e.currentTarget.src =
                                "https://ui-avatars.com/api/?name=" +
                                app.userId.username)
                            }
                          />
                          <div>
                            <div className="font-bold">
                              {app.basicInfo.fullName}
                            </div>
                            <div className="text-xs text-gray-400">
                              {app.userId.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">
                        {app.basicInfo.school} ({app.basicInfo.year})
                      </td>
                      <td className="p-4">
                        {app.accepted ? (
                          <span className="bg-green-900/50 text-green-300 px-2 py-1 rounded text-xs font-bold border border-green-800">
                            ACCEPTED
                          </span>
                        ) : (
                          <span className="bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded text-xs font-bold border border-yellow-800">
                            PENDING
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {app.rsvpd ? (
                          <span className="text-green-400 font-bold">YES</span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </td>
                      <td className="p-4">
                        {!app.accepted && (
                          <button
                            onClick={() => updateStatus(app._id, "accepted")}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold mr-2"
                          >
                            Accept
                          </button>
                        )}
                        {app.accepted && (
                          <button
                            onClick={() => updateStatus(app._id, "rejected")}
                            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm font-bold"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {applications.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No applications found.
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
