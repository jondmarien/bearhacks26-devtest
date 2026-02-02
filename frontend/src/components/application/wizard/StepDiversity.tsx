import React from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { ApplicationData } from "@shared/schemas/application";
import { motion } from "framer-motion";

interface StepProps {
  register: UseFormRegister<ApplicationData>;
  errors: FieldErrors<ApplicationData>;
  setValue: UseFormSetValue<ApplicationData>;
  watch: UseFormWatch<ApplicationData>;
}

const Pill = ({ label, value, selected, onClick }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-all duration-300 ${
      selected
        ? "bg-purple-500 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]"
        : "bg-gray-800/50 border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300"
    }`}
  >
    {label}
  </button>
);

const StepDiversity: React.FC<StepProps> = ({
  register,
  errors,
  setValue,
  watch,
}) => {
  const currentGender = watch("diversity.gender");
  const currentPronouns = watch("diversity.pronouns");

  const genders = [
    "Prefer not to say",
    "Male",
    "Female",
    "Non-binary",
    "Genderqueer",
    "Two-Spirit",
  ];
  const pronouns = [
    "Prefer not to say",
    "He/him",
    "She/her",
    "They/them",
    "He/they",
    "She/they",
  ];
  const ethnicities = [
    "Prefer not to say",
    "American Indian or Alaska Native",
    "Asian",
    "Black or African American",
    "Hispanic or Latino",
    "Native Hawaiian or Other Pacific Islander",
    "White",
    "Middle Eastern",
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <motion.div
          animate={{ rotate: [0, 20, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-4xl"
        >
          🤝
        </motion.div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-white font-display">
          Diversity Check
        </h2>
      </div>

      <p className="text-gray-400 text-sm">
        This part is completely{" "}
        <span className="underline decoration-pink-500">optional</span>, but
        helps us make BearHacks more inclusive.
      </p>

      <div className="space-y-4">
        <label className="block text-lg font-bold text-white mb-2">
          <span className="text-pink-400 text-xs mr-2">◆</span> Gender
        </label>
        <div className="flex flex-wrap gap-3">
          {genders.map((g) => (
            <Pill
              key={g}
              label={g}
              value={g}
              selected={currentGender === g}
              onClick={() =>
                setValue("diversity.gender", g, { shouldValidate: true })
              }
            />
          ))}
        </div>
        <input
          {...register("diversity.genderOther")}
          placeholder="Other (please specify)"
          className="w-full mt-2 bg-gray-900/50 border-2 border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 outline-hidden transition-all"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-bold text-white mb-2">
          <span className="text-pink-400 text-xs mr-2">◆</span> Pronouns
        </label>
        <div className="flex flex-wrap gap-3">
          {pronouns.map((p) => (
            <Pill
              key={p}
              label={p}
              value={p}
              selected={currentPronouns === p}
              onClick={() =>
                setValue("diversity.pronouns", p, { shouldValidate: true })
              }
            />
          ))}
        </div>
        <input
          {...register("diversity.pronounsOther")}
          placeholder="Other (please specify)"
          className="w-full mt-2 bg-gray-900/50 border-2 border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 outline-hidden transition-all"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-bold text-white mb-2">
          <span className="text-pink-400 text-xs mr-2">◆</span> What is your
          ethnicity?
        </label>
        <div className="relative">
          <select
            {...register("diversity.ethnicity")}
            className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-xl px-4 py-3 text-white appearance-none focus:border-purple-500 outline-hidden"
          >
            <option value="" disabled selected>
              Select your ethnicity
            </option>
            {ethnicities.map((e) => (
              <option key={e} value={e} className="bg-gray-900">
                {e}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            ▼
          </div>
        </div>
      </div>
      {/* Decorative Mascot */}
      <motion.div
        className="absolute -right-5 bottom-40 pointer-events-none hidden md:block"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Blue Star-like Mascot */}
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          <path
            d="M50 0L60 35L95 35L65 55L75 90L50 70L25 90L35 55L5 35L40 35L50 0Z"
            fill="#3B82F6"
          />
          <path
            d="M40 45Q50 55 60 45"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="42" cy="40" r="2" fill="white" />
          <circle cx="58" cy="40" r="2" fill="white" />
        </svg>
      </motion.div>
    </div>
  );
};

export default StepDiversity;
