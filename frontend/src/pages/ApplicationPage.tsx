import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ApplicationPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    basicInfo: { fullName: "", email: "", school: "", year: "", location: "" },
    skillsAndLinks: { skills: "", githubUrl: "", portfolioUrl: "" },
    accessibility: {
      allergies: "",
      dietaryRestrictions: "",
      accommodations: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Get token
        const res = await axios.get(`${API_URL}/api/application/me`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.data.exists !== false) {
          // Populate form
          const { basicInfo, skillsAndLinks, accessibility } = res.data;
          setFormData({
            basicInfo: { ...formData.basicInfo, ...basicInfo },
            skillsAndLinks: {
              ...formData.skillsAndLinks,
              ...skillsAndLinks,
              skills: skillsAndLinks.skills
                ? skillsAndLinks.skills.join(", ")
                : "",
            },
            accessibility: { ...formData.accessibility, ...accessibility },
          });
        } else {
          // New application, prefill name/email if possible
          setFormData((prev) => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, fullName: user.username },
          }));
        }
      } catch (err) {
        console.error("Failed to load application", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [user]);

  if (authLoading) return <div>Loading Auth...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (loading)
    return <div className="p-8 text-white">Loading Application...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      skillsAndLinks: {
        ...formData.skillsAndLinks,
        skills: formData.skillsAndLinks.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      },
    };

    try {
      const token = localStorage.getItem("authToken"); // Get token
      await axios.post(`${API_URL}/api/application/me`, payload, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {}, // Send token
      });
      alert("Application Saved!");
      navigate("/app/rsvp", { replace: true });
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save application.");
    }
  };

  const handleChange = (
    section: keyof typeof formData,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof formData],
        [field]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Hacker Application</h2>
          <button
            onClick={() => navigate("/app/rsvp")}
            className="text-blue-400 hover:text-blue-300"
          >
            Go to RSVP &rarr;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-purple-400">
              Basic Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                required
                className="bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
                value={formData.basicInfo.fullName}
                onChange={(e) =>
                  handleChange("basicInfo", "fullName", e.target.value)
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
                value={formData.basicInfo.email}
                onChange={(e) =>
                  handleChange("basicInfo", "email", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="School / University"
                className="bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
                value={formData.basicInfo.school}
                onChange={(e) =>
                  handleChange("basicInfo", "school", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Graduation Year"
                className="bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
                value={formData.basicInfo.year}
                onChange={(e) =>
                  handleChange("basicInfo", "year", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Location (City, Country)"
                className="bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
                value={formData.basicInfo.location}
                onChange={(e) =>
                  handleChange("basicInfo", "location", e.target.value)
                }
              />
            </div>
          </section>

          {/* Skills */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-purple-400">
              Skills & Links
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Skills (comma separated, e.g. React, Node, Python)"
                className="w-full bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
                value={formData.skillsAndLinks.skills}
                onChange={(e) =>
                  handleChange("skillsAndLinks", "skills", e.target.value)
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="GitHub URL"
                  className="bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
                  value={formData.skillsAndLinks.githubUrl}
                  onChange={(e) =>
                    handleChange("skillsAndLinks", "githubUrl", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Portfolio URL"
                  className="bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
                  value={formData.skillsAndLinks.portfolioUrl}
                  onChange={(e) =>
                    handleChange(
                      "skillsAndLinks",
                      "portfolioUrl",
                      e.target.value,
                    )
                  }
                />
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
                className="w-full bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none h-20"
                value={formData.accessibility.dietaryRestrictions}
                onChange={(e) =>
                  handleChange(
                    "accessibility",
                    "dietaryRestrictions",
                    e.target.value,
                  )
                }
              />
              <textarea
                placeholder="Accommodations / Allergies / Other needs"
                className="w-full bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none h-20"
                value={formData.accessibility.accommodations}
                onChange={(e) =>
                  handleChange(
                    "accessibility",
                    "accommodations",
                    e.target.value,
                  )
                }
              />
            </div>
          </section>

          <button
            type="submit"
            className="w-full py-4 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg font-bold text-lg hover:brightness-110 transition-all shadow-lg"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationPage;
