import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ApplicationData } from "@shared/schemas/application";
import { motion } from "framer-motion";

interface StepProps {
  register: UseFormRegister<ApplicationData>;
  errors: FieldErrors<ApplicationData>;
}

const ConsentCheckbox = ({
  label,
  name,
  register,
  error,
  isOptional = false,
}: {
  label: React.ReactNode;
  name: any;
  register: UseFormRegister<ApplicationData>;
  error?: any;
  isOptional?: boolean;
}) => (
  <div className="flex items-start space-x-3 p-4 bg-gray-900/30 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
    <div className="relative flex items-center pt-1">
      <input
        type="checkbox"
        {...register(name)}
        className="peer h-5 w-5 appearance-none rounded border border-gray-600 bg-gray-900/50 checked:border-purple-500 checked:bg-purple-500 hover:border-purple-400 transition-all cursor-pointer"
      />
      <svg
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity font-bold"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <div className="space-y-1 flex-1">
      <label className="text-sm text-gray-300 leading-relaxed cursor-pointer block select-none">
        {label}
        {!isOptional && <span className="text-red-400 ml-1">*</span>}
      </label>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-red-400 text-xs font-bold"
        >
          {error.message}
        </motion.p>
      )}
    </div>
  </div>
);

const StepConsent: React.FC<StepProps> = ({ register, errors }) => {
  const c = errors.consent;

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-400">
          Consent & Agreement
        </h2>
        <p className="text-gray-400">
          Before we wrap up — please confirm the following.
        </p>
      </div>

      <div className="space-y-4">
        <ConsentCheckbox
          name="consent.shareWithSponsors"
          register={register}
          error={c?.shareWithSponsors}
          label="I agree to have my resume and other personal information shared with sponsors of this event."
        />

        <ConsentCheckbox
          name="consent.mlhCodeOfConduct"
          register={register}
          error={c?.mlhCodeOfConduct}
          label={
            <>
              I have read over the{" "}
              <a
                href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                MLH Code of Conduct
              </a>{" "}
              to be able to participate in Hackville 2026.
            </>
          }
        />

        <ConsentCheckbox
          name="consent.mlhPrivacyPolicy"
          register={register}
          error={c?.mlhPrivacyPolicy}
          label={
            <>
              I authorize you to share my application/registration information
              with Major League Hacking for event administration, ranking, and
              MLH administration in line with the{" "}
              <a
                href="https://mlh.io/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                MLH Privacy Policy
              </a>
              . I further agree to the terms of both the{" "}
              <a
                href="https://github.com/MLH/mlh-policies/blob/master/contest-terms.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                MLH Contest Terms and Conditions
              </a>{" "}
              and the{" "}
              <a
                href="https://mlh.io/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                MLH Privacy Policy
              </a>
              .
            </>
          }
        />

        <ConsentCheckbox
          name="consent.mlhEmails"
          register={register}
          error={c?.mlhEmails}
          isOptional={true}
          label={
            <>
              I authorize MLH to send me occasional emails about relevant
              events, career opportunities, and community announcements.
            </>
          }
        />

        <ConsentCheckbox
          name="consent.commute"
          register={register}
          error={c?.commute}
          label="I can attend the event without travel reimbursement or visa invitations provided by Hackville."
        />

        <ConsentCheckbox
          name="consent.accurateInfo"
          register={register}
          error={c?.accurateInfo}
          label="I confirm that the information I provided is accurate and I agree to the terms above."
        />
      </div>
    </div>
  );
};

export default StepConsent;
