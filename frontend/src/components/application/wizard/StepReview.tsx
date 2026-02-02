import React from "react";
import type { ApplicationData } from "@shared/schemas/application";
import { motion } from "framer-motion";

interface StepProps {
  formData: ApplicationData;
}

const ReviewSection = ({ title, children }: any) => (
  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-300 to-indigo-400 mb-4 font-display">
      {title}
    </h3>
    <div className="space-y-2 text-sm text-gray-300">{children}</div>
  </div>
);

const ReviewRow = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) => {
  if (!value) return null;
  return (
    <div className="grid grid-cols-3 gap-4 border-b border-gray-700/50 pb-2 last:border-0 last:pb-0">
      <span className="font-bold text-gray-500 col-span-1">{label}</span>
      <span className="text-white col-span-2 break-all">{value}</span>
    </div>
  );
};

const StepReview: React.FC<StepProps> = ({ formData }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="text-4xl"
        >
          🚀
        </motion.div>
        <h2 className="text-3xl font-bold text-white font-display">
          Review & Submit
        </h2>
      </div>

      <p className="text-gray-400">
        You're almost there! Please check your information one last time before
        blasting off.
      </p>

      <div className="space-y-6">
        <ReviewSection title="About You">
          <ReviewRow
            label="Name"
            value={`${formData.basicInfo.firstName} ${formData.basicInfo.lastName}`}
          />
          <ReviewRow label="Email" value={formData.basicInfo.email} />
          <ReviewRow label="Phone" value={formData.basicInfo.phone} />
          <ReviewRow
            label="Location"
            value={`${formData.basicInfo.city}, ${formData.basicInfo.country}`}
          />
          <ReviewRow label="School" value={formData.basicInfo.school} />
          <ReviewRow
            label="Major"
            value={`${formData.basicInfo.major} (${formData.basicInfo.year})`}
          />
        </ReviewSection>

        <ReviewSection title="Experience">
          <ReviewRow
            label="Hackathons"
            value={formData.hackerExperience.hackathonCount}
          />
          <ReviewRow
            label="Role"
            value={formData.hackerExperience.hackerType}
          />
          <ReviewRow
            label="Interests"
            value={formData.hackerExperience.workshops?.join(", ")}
          />
        </ReviewSection>

        <ReviewSection title="Work & Links">
          <ReviewRow label="GitHub" value={formData.work.githubUrl} />
          <ReviewRow label="LinkedIn" value={formData.work.linkedinUrl} />
          <ReviewRow label="Portfolio" value={formData.work.portfolioUrl} />
          <ReviewRow label="Roles" value={formData.work.roles?.join(", ")} />
        </ReviewSection>

        {((formData.additionalNeeds.dietary &&
          formData.additionalNeeds.dietary.length > 0) ||
          formData.additionalNeeds.accessibility) && (
          <ReviewSection title="Needs">
            <ReviewRow
              label="Dietary"
              value={formData.additionalNeeds.dietary?.join(", ")}
            />
            <ReviewRow
              label="Accessibility"
              value={formData.additionalNeeds.accessibility}
            />
          </ReviewSection>
        )}
      </div>

      <div className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/30 text-center">
        <p className="text-indigo-300 text-sm">
          By submitting this application, you agree to the BearHacks code of
          conduct and privacy policy. 🐻
        </p>
      </div>
    </div>
  );
};

export default StepReview;
