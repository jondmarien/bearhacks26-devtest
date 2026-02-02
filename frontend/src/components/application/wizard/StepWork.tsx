import React from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import type { ApplicationData } from "@shared/schemas/application";
import { motion } from "framer-motion";

interface StepProps {
  register: UseFormRegister<ApplicationData>;
  errors: FieldErrors<ApplicationData>;
  setValue: UseFormSetValue<ApplicationData>;
}

const InputField = ({ label, name, register, error, placeholder }: any) => (
  <div className="space-y-1.5">
    <label className="text-sm font-bold text-gray-300 ml-1">{label}</label>
    <input
      {...register(name)}
      placeholder={placeholder}
      className={`w-full bg-gray-900/50 border-2 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-hidden transition-all duration-300 ${
        error
          ? "border-red-500/50 focus:border-red-500"
          : "border-gray-700 hover:border-gray-600 focus:border-pink-500"
      }`}
    />
    {error && <p className="text-red-400 text-xs ml-1">{error.message}</p>}
  </div>
);

const CheckboxIdx = ({ label, value, register, name }: any) => (
  <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
    <input
      type="checkbox"
      value={value}
      {...register(name)}
      className="hidden peer"
    />
    <div className="w-5 h-5 rounded border-2 border-gray-600 peer-checked:border-pink-500 peer-checked:bg-pink-500 relative flex items-center justify-center transition-all">
      <svg
        className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={4}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <span className="text-gray-300 group-hover:text-white transition-colors text-sm">
      {label}
    </span>
  </label>
);

const StepWork: React.FC<StepProps> = ({ register, errors, setValue }) => {
  const w = errors.work;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-4xl"
        >
          💼
        </motion.div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-300 to-rose-400 font-display">
          Your Work
        </h2>
      </div>

      <div className="bg-gray-800/30 p-4 rounded-xl border border-dashed border-gray-700 mb-6">
        <p className="text-gray-400 text-sm flex items-center gap-2">
          <span>✨</span> Drop any link you want to share - LinkedIn, Github, or
          your Portfolio
        </p>
      </div>

      <div className="space-y-4">
        <InputField
          label="Github Profile URL"
          name="work.githubUrl"
          register={register}
          error={w?.githubUrl}
          placeholder="https://github.com/..."
        />
        <InputField
          label="LinkedIn Profile URL"
          name="work.linkedinUrl"
          register={register}
          error={w?.linkedinUrl}
          placeholder="https://linkedin.com/in/..."
        />
        <InputField
          label="Portfolio/Personal Site"
          name="work.portfolioUrl"
          register={register}
          error={w?.portfolioUrl}
          placeholder="https://mywebsite.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-300 ml-1">
          Have a resume? PDF only.
        </label>
        <div className="relative border-2 border-dashed border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-pink-500 hover:bg-gray-800/30 transition-all cursor-pointer group text-center">
          {/* 
                NOTE: File upload handling would typically require a separate state and handler not directly supported by simple register. 
                For this UI mockup, we'll keep the input but in a real app create a dedicated dropzone component 
            */}
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              // In a real implementation we would upload this and setValue the URL
              if (file) alert("Resume upload simulation: " + file.name);
            }}
          />
          <div className="text-3xl group-hover:scale-110 transition-transform">
            📄
          </div>
          <p className="font-bold text-gray-300">Choose file</p>
          <p className="text-xs text-gray-500">
            Click to upload or drag and drop (max 5MB)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-white mb-2">
          What role do you wish to assume for future work/internship
          opportunities?
        </label>
        <div className="grid grid-cols-1 gap-2">
          {[
            "Front-end Development",
            "Back-end Development",
            "Design",
            "Project Management",
            "Data Science",
            "DevOps",
          ].map((role) => (
            <CheckboxIdx
              key={role}
              label={role}
              value={role}
              register={register}
              name="work.roles"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-white mb-2">
          What co-ops you are interested in?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Summer 2026",
            "Fall 2026",
            "Winter 2026",
            "Summer 2027",
            "Fall 2027",
            "Winter 2027",
          ].map((term) => (
            <CheckboxIdx
              key={term}
              label={term}
              value={term}
              register={register}
              name="work.coops"
            />
          ))}
          <CheckboxIdx
            label="Not Interested"
            value="Not Interested"
            register={register}
            name="work.coops"
          />
        </div>
      </div>
    </div>
  );
};

export default StepWork;
