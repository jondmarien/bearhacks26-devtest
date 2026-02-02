import React from "react";
import type { Application, TestApplication } from "@/types/admin";
import { motion, AnimatePresence } from "framer-motion";
import {
  EntranceScale,
  HoverSpring,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/MotionComponents";
import { FADE_IN_VARIANTS } from "@/styles/animations";

interface ApplicationReviewModalProps {
  app: Application | TestApplication;
  onClose: () => void;
  updateStatus: (
    id: string,
    status: "accepted" | "rejected",
    isTest: boolean,
  ) => Promise<void>;
}

const ApplicationReviewModal: React.FC<ApplicationReviewModalProps> = ({
  app,
  onClose,
  updateStatus,
}) => {
  const isHacker = "userId" in app;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        variants={FADE_IN_VARIANTS}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <EntranceScale className="relative bg-gray-900 w-full max-w-2xl border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-start bg-gray-900/50">
          <div className="flex items-center gap-4">
            {isHacker && (
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                src={`https://cdn.discordapp.com/avatars/${app.userId.discordId}/${app.userId.avatar}.png`}
                alt="avatar"
                className="w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 shadow-xl"
                onError={(e) =>
                  (e.currentTarget.src = `https://ui-avatars.com/api/?name=${app.userId.username}&background=random`)
                }
              />
            )}
            <div className="space-y-1">
              <motion.h2
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-black text-white"
              >
                {app.basicInfo.firstName} {app.basicInfo.lastName}
              </motion.h2>
              <motion.p
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-gray-400 font-medium"
              >
                {isHacker
                  ? app.userId.email
                  : `Test Subject #${app._id.slice(-6)}`}
              </motion.p>
            </div>
          </div>
          <HoverSpring>
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
          </HoverSpring>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Basic Info Grid */}
          <StaggerContainer className="grid grid-cols-2 gap-6">
            {[
              { label: "School", value: app.basicInfo.school },
              { label: "Graduation", value: `Class of ${app.basicInfo.year}` },
              {
                label: "Major",
                value: app.basicInfo.major || "N/A",
              },
              {
                label: "Location",
                value:
                  `${app.basicInfo.city}, ${app.basicInfo.country}` || "N/A",
              },
              {
                label: "Discord",
                value: isHacker
                  ? app.userId.username
                  : app.basicInfo.discord || "N/A",
              },
            ].map((item) => (
              <StaggerItem key={item.label} className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  {item.label}
                </label>
                <p className="text-gray-200 font-bold">{item.value}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <hr className="border-gray-800" />

          {/* Experience Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span className="w-1.5 h-4 bg-purple-500 rounded-full"></span>
              Experience & Work
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-xs text-gray-500 uppercase font-bold">
                  Hackathons
                </span>
                <p className="text-white font-medium">
                  {app.hackerExperience?.hackathonCount || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-bold">
                  Hacker Type
                </span>
                <p className="text-white font-medium">
                  {app.hackerExperience?.hackerType || "N/A"}
                </p>
              </div>
            </div>

            <StaggerContainer className="flex flex-wrap gap-2">
              {app.hackerExperience?.workshops &&
                app.hackerExperience.workshops.length > 0 && (
                  <>
                    <span className="text-xs text-gray-500 w-full mb-1">
                      Interests:
                    </span>
                    {app.hackerExperience.workshops.map((ws, i) => (
                      <StaggerItem
                        key={i}
                        className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg font-bold"
                      >
                        {ws}
                      </StaggerItem>
                    ))}
                  </>
                )}
            </StaggerContainer>

            <div className="grid grid-cols-1 gap-3 mt-4">
              {app.work?.githubUrl && (
                <HoverSpring>
                  <a
                    href={app.work.githubUrl}
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
                      {app.work.githubUrl}
                    </span>
                  </a>
                </HoverSpring>
              )}
              {app.work?.portfolioUrl && (
                <HoverSpring>
                  <a
                    href={app.work.portfolioUrl}
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
                      {app.work.portfolioUrl}
                    </span>
                  </a>
                </HoverSpring>
              )}
              {app.work?.linkedinUrl && (
                <HoverSpring>
                  <a
                    href={app.work.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-950 rounded-lg text-white">
                      <span className="font-bold text-xs">IN</span>
                    </div>
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white truncate">
                      {app.work.linkedinUrl}
                    </span>
                  </a>
                </HoverSpring>
              )}
            </div>
          </div>

          <hr className="border-gray-800" />

          {/* Additional Needs */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
              Needs & Logistics
            </h3>
            <StaggerContainer className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-4">
              {[
                {
                  label: "Dietary Restrictions",
                  value: app.additionalNeeds?.dietary?.join(", ") || "None",
                },
                {
                  label: "Accessibility",
                  value: app.additionalNeeds?.accessibility || "None",
                },
                {
                  label: "Ethnicity",
                  value: app.diversity?.ethnicity || "Prefer not to say",
                },
                {
                  label: "Gender / Pronouns",
                  value:
                    `${app.diversity?.gender || ""} ${app.diversity?.pronouns ? `(${app.diversity.pronouns})` : ""}`.trim() ||
                    "Prefer not to say",
                },
              ].map((item) => (
                <StaggerItem key={item.label}>
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">
                    {item.label}
                  </label>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.value}
                  </p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          <hr className="border-gray-800" />

          {/* Consent & Agreements */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span className="w-1.5 h-4 bg-green-500 rounded-full"></span>
              Consent & Agreements
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-green-500/5 rounded-2xl border border-green-500/10">
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${app.consent?.shareWithSponsors ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                >
                  {app.consent?.shareWithSponsors ? "✓" : "✕"}
                </div>
                <span className="text-xs text-gray-300 font-medium">
                  Shared with Sponsors
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${app.consent?.mlhCodeOfConduct ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                >
                  {app.consent?.mlhCodeOfConduct ? "✓" : "✕"}
                </div>
                <span className="text-xs text-gray-300 font-medium">
                  MLH Code of Conduct
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${app.consent?.mlhPrivacyPolicy ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                >
                  {app.consent?.mlhPrivacyPolicy ? "✓" : "✕"}
                </div>
                <span className="text-xs text-gray-300 font-medium">
                  MLH Privacy Policy
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${app.consent?.commute ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                >
                  {app.consent?.commute ? "✓" : "✕"}
                </div>
                <span className="text-xs text-gray-300 font-medium">
                  Commute / Travel
                </span>
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
              <HoverSpring>
                <button
                  onClick={() => updateStatus(app._id, "accepted", !isHacker)}
                  className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-xl border border-green-400/20"
                >
                  Accept Applicant
                </button>
              </HoverSpring>
            ) : (
              <HoverSpring>
                <button
                  onClick={() => updateStatus(app._id, "rejected", !isHacker)}
                  className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-xl border border-red-400/20"
                >
                  Revoke Acceptance
                </button>
              </HoverSpring>
            )}
          </div>
        </div>
      </EntranceScale>
    </div>
  );
};

export default ApplicationReviewModal;
