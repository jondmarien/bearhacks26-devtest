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
import SubmissionErrorModal from "@/components/application/SubmissionErrorModal";
import AdminTestAppsList from "@/components/application/AdminTestAppsList";
import LoadingScreen from "@/components/layout/LoadingScreen";
import {
  BasicInfoSection,
  SkillsLinksSection,
  AccessibilitySection,
} from "@/components/application/FormSections";

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

  if (authLoading) return <LoadingScreen message="Checking Credentials..." />;
  if (!user) return <Navigate to="/" replace />;
  if (loading) return <LoadingScreen message="Fetching Application..." />;

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
      <div className="flex-1 flex flex-col items-center p-4 pt-24 pb-12">
        {submitError && (
          <SubmissionErrorModal
            error={submitError}
            onClose={() => setSubmitError(null)}
            onCopy={copyErrorToClipboard}
          />
        )}

        {user.role === "admin" && <AdminTestAppsList apps={adminApps} />}

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
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Go to RSVP &rarr;
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-10">
            <BasicInfoSection register={register} errors={errors} />
            <hr className="border-gray-700/50" />
            <SkillsLinksSection
              register={register}
              errors={errors}
              setValue={setValue}
            />
            <hr className="border-gray-700/50" />
            <AccessibilitySection register={register} errors={errors} />

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
