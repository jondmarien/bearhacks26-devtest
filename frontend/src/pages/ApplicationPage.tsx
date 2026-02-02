import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Logger from "@/utils/Logger";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ApplicationSchema,
  type ApplicationData,
} from "@shared/schemas/application";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface AdminApp {
  _id: string;
  basicInfo: { fullName: string };
  accepted: boolean;
  rsvpd: boolean;
  createdAt: string;
}

const ApplicationPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminApps, setAdminApps] = useState<AdminApp[]>([]);
  const [submitError, setSubmitError] = useState<{
    message: string;
    details?: any;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ApplicationData>({
    resolver: zodResolver(ApplicationSchema),
  });

  useEffect(() => {
    if (!user) return;

    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (user.role === "admin") {
          const res = await axios.get(`${API_URL}/api/admin/my-apps`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          setAdminApps(res.data);
          reset({
            basicInfo: {
              fullName: user.username,
              email: "",
              school: "",
              year: "",
              location: "",
            },
            skillsAndLinks: {
              skills: [],
              githubUrl: "",
              portfolioUrl: "",
              otherLinks: [],
            },
            accessibility: {
              allergies: "",
              dietaryRestrictions: "",
              accommodations: "",
            },
          });
        } else {
          const res = await axios.get(`${API_URL}/api/application/me`, {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (res.data.exists !== false) {
            reset(res.data);
          } else {
            reset({
              basicInfo: {
                fullName: user.username,
                email: "",
                school: "",
                year: "",
                location: "",
              },
              skillsAndLinks: {
                skills: [],
                githubUrl: "",
                portfolioUrl: "",
                otherLinks: [],
              },
              accessibility: {
                allergies: "",
                dietaryRestrictions: "",
                accommodations: "",
              },
            });
          }
        }
      } catch (err) {
        Logger.error("Failed to load application", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [user, reset]);

  if (authLoading)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading Auth...
      </div>
    );
  if (!user) return <Navigate to="/" replace />;
  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading Application...
      </div>
    );

  const onFormSubmit = async (data: ApplicationData) => {
    setSubmitError(null);
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(`${API_URL}/api/application/me`, data, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (user.role === "admin") {
        const res = await axios.get(`${API_URL}/api/admin/my-apps`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setAdminApps(res.data);
        reset({
          basicInfo: {
            fullName: user.username,
            email: "",
            school: "",
            year: "",
            location: "",
          },
          skillsAndLinks: {
            skills: [],
            githubUrl: "",
            portfolioUrl: "",
            otherLinks: [],
          },
          accessibility: {
            allergies: "",
            dietaryRestrictions: "",
            accommodations: "",
          },
        });
        alert("Test Application Saved!");
      } else {
        alert("Application Saved!");
        navigate("/app/rsvp", { replace: true });
      }
    } catch (err: any) {
      Logger.error("Save failed", err);
      const errorMsg =
        err.response?.data?.message || "Failed to save application.";
      const errorDetail = err.response?.data?.error || err.message;
      setSubmitError({ message: errorMsg, details: errorDetail });
    }
  };

  const copyErrorToClipboard = () => {
    if (submitError) {
      const text = `Error: ${submitError.message}\nDetails: ${JSON.stringify(submitError.details, null, 2)}`;
      navigator.clipboard.writeText(text);
      alert("Error details copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative">
      <Navbar />
      <div className="flex-1 flex flex-col items-center p-4 pt-24">
        {/* Error Modal */}
        {submitError && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gray-800 border border-red-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-hidden flex flex-col ring-1 ring-red-500/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <svg
                      className="w-6 h-6 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Submission Error
                  </h3>
                </div>
                <button
                  onClick={() => setSubmitError(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor font-bold"
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

              <p className="text-gray-300 mb-4 font-medium">
                {submitError.message}
              </p>

              <div className="bg-black/50 rounded-xl p-4 mb-6 border border-gray-700">
                <p className="text-xs font-mono text-red-300/80 break-all leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
                  {typeof submitError.details === "object"
                    ? JSON.stringify(submitError.details, null, 2)
                    : submitError.details}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyErrorToClipboard}
                  className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-all border border-gray-600 flex items-center justify-center gap-2 group"
                >
                  <svg
                    className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  Copy Details
                </button>
                <button
                  onClick={() => setSubmitError(null)}
                  className="flex-1 py-3 px-4 bg-linear-to-r from-red-600 to-red-500 hover:brightness-110 rounded-xl font-bold transition-all shadow-lg"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Section */}
        {user.role === "admin" && (
          <div className="w-full max-w-4xl mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">
              Admin Test Applications
            </h2>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              {adminApps.length === 0 ? (
                <p className="text-gray-400">No test applications yet.</p>
              ) : (
                <div className="space-y-2">
                  {adminApps.map((app) => (
                    <div
                      key={app._id}
                      className="flex justify-between items-center bg-gray-700 p-3 rounded"
                    >
                      <div>
                        <span className="font-bold">
                          {app.basicInfo.fullName}
                        </span>
                        <span className="ml-2 text-xs text-gray-400">
                          {new Date(app.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <span
                          className={
                            app.accepted ? "text-green-400" : "text-yellow-400"
                          }
                        >
                          {app.accepted ? "Accepted" : "Pending"}
                        </span>
                        <span
                          className={
                            app.rsvpd ? "text-green-400" : "text-gray-400"
                          }
                        >
                          {app.rsvpd ? "RSVP'd" : "No RSVP"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Container */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-4xl w-full border border-gray-700 relative overflow-hidden">
          {isSubmitting && (
            <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">
              {user.role === "admin"
                ? "Create Test Application"
                : "Hacker Application"}
            </h2>
            {!isSubmitting && (
              <button
                onClick={() => navigate("/app/rsvp")}
                className="text-blue-400 hover:text-blue-300"
              >
                Go to RSVP &rarr;
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Basic Info */}
            <section>
              <h3 className="text-xl font-semibold mb-3 text-purple-400">
                Basic Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="Full Name"
                    {...register("basicInfo.fullName")}
                    className={`bg-gray-700 p-3 rounded border ${errors.basicInfo?.fullName ? "border-red-500" : "border-gray-600"} focus:border-purple-500 outline-none`}
                  />
                  {errors.basicInfo?.fullName && (
                    <span className="text-red-400 text-xs ml-1">
                      {errors.basicInfo.fullName.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="email"
                    placeholder="Email"
                    {...register("basicInfo.email")}
                    className={`bg-gray-700 p-3 rounded border ${errors.basicInfo?.email ? "border-red-500" : "border-gray-600"} focus:border-purple-500 outline-none`}
                  />
                  {errors.basicInfo?.email && (
                    <span className="text-red-400 text-xs ml-1">
                      {errors.basicInfo.email.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="School / University"
                    {...register("basicInfo.school")}
                    className="bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="Graduation Year (e.g. 2026)"
                    {...register("basicInfo.year")}
                    className={`bg-gray-700 p-3 rounded border ${errors.basicInfo?.year ? "border-red-500" : "border-gray-600"} focus:border-purple-500 outline-none`}
                  />
                  {errors.basicInfo?.year && (
                    <span className="text-red-400 text-xs ml-1">
                      {errors.basicInfo.year.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <input
                    type="text"
                    placeholder="Location (City, Country)"
                    {...register("basicInfo.location")}
                    className="bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Skills */}
            <section>
              <h3 className="text-xl font-semibold mb-3 text-purple-400">
                Skills & Links
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="Skills (comma separated, e.g. React, Node, Python)"
                    className="w-full bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
                    onChange={(e) => {
                      const skills = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      setValue("skillsAndLinks.skills", skills);
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      placeholder="GitHub URL"
                      {...register("skillsAndLinks.githubUrl")}
                      className={`bg-gray-700 p-3 rounded border ${errors.skillsAndLinks?.githubUrl ? "border-red-500" : "border-gray-600"} focus:border-purple-500 outline-none`}
                    />
                    {errors.skillsAndLinks?.githubUrl && (
                      <span className="text-red-400 text-xs ml-1">
                        {errors.skillsAndLinks.githubUrl.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      placeholder="Portfolio URL"
                      {...register("skillsAndLinks.portfolioUrl")}
                      className={`bg-gray-700 p-3 rounded border ${errors.skillsAndLinks?.portfolioUrl ? "border-red-500" : "border-gray-600"} focus:border-purple-500 outline-none`}
                    />
                    {errors.skillsAndLinks?.portfolioUrl && (
                      <span className="text-red-400 text-xs ml-1">
                        {errors.skillsAndLinks.portfolioUrl.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Accessibility */}
            <section>
              <h3 className="text-xl font-semibold mb-3 text-purple-400">
                Accessibility & Needs
              </h3>
              <div className="space-y-4">
                <textarea
                  placeholder="Dietary Restrictions"
                  {...register("accessibility.dietaryRestrictions")}
                  className="w-full bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none h-20"
                />
                <textarea
                  placeholder="Accommodations / Allergies / Other needs"
                  {...register("accessibility.accommodations")}
                  className="w-full bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none h-20"
                />
              </div>
            </section>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg font-bold text-lg hover:brightness-110 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Processing..."
                : user.role === "admin"
                  ? "Create Test Record"
                  : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
