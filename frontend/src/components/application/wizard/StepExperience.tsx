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

const RadioCard = ({
  label,
  description,
  value,
  currentValue,
  onChange,
  icon,
}: any) => (
  <div
    onClick={() => onChange(value)}
    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 group ${
      currentValue === value
        ? "bg-purple-500/10 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
        : "bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800"
    }`}
  >
    <div
      className={`text-2xl p-3 rounded-full ${currentValue === value ? "bg-purple-500/20 text-purple-300" : "bg-gray-700 text-gray-400"}`}
    >
      {icon}
    </div>
    <div>
      <h3
        className={`font-bold ${currentValue === value ? "text-white" : "text-gray-300"}`}
      >
        {label}
      </h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

const RadioCircle = ({ label, value, register, name }: any) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <input
      type="radio"
      value={value}
      {...register(name)}
      className="hidden peer"
    />
    <div className="w-5 h-5 rounded-full border-2 border-gray-600 peer-checked:border-purple-500 peer-checked:bg-purple-500 relative flex items-center justify-center transition-all">
      <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
    </div>
    <span className="text-gray-300 font-medium group-hover:text-white transition-colors">
      {label}
    </span>
  </label>
);

const Checkbox = ({ label, value, register, name }: any) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <input
      type="checkbox"
      value={value}
      {...register(name)}
      className="hidden peer"
    />
    <div className="w-5 h-5 rounded border-2 border-gray-600 peer-checked:border-purple-500 peer-checked:bg-purple-500 relative flex items-center justify-center transition-all">
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
    <span className="text-gray-300 group-hover:text-white transition-colors">
      {label}
    </span>
  </label>
);

const StepExperience: React.FC<StepProps> = ({
  register,
  errors,
  setValue,
  watch,
}) => {
  const he = errors.hackerExperience;
  const currentType = watch("hackerExperience.hackerType");

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-4xl"
        >
          🛠️
        </motion.div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-300 to-indigo-400 font-display">
          Hacker Experience
        </h2>
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-bold text-white mb-2">
          How many hackathons have you been to?{" "}
          <span className="text-red-400">*</span>
        </label>
        <div className="space-y-3 pl-2">
          <RadioCircle
            label="First time here"
            value="First time here"
            register={register}
            name="hackerExperience.hackathonCount"
          />
          <RadioCircle
            label="Built a few projects (1-2)"
            value="Built a few projects (1-2)"
            register={register}
            name="hackerExperience.hackathonCount"
          />
          <RadioCircle
            label="Hackathons are life (3+)"
            value="Hackathons are life (3+)"
            register={register}
            name="hackerExperience.hackathonCount"
          />
        </div>
        {he?.hackathonCount && (
          <p className="text-red-400 text-sm">{he.hackathonCount.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-bold text-white mb-2">
          Are you more of a...? <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RadioCard
            label="Developer"
            description="I bring ideas to life with code!"
            value="Developer"
            currentValue={currentType}
            onChange={(val: any) =>
              setValue("hackerExperience.hackerType", val, {
                shouldValidate: true,
              })
            }
            icon="💻"
          />
          <RadioCard
            label="Designer"
            description="I create visuals and user experiences."
            value="Designer"
            currentValue={currentType}
            onChange={(val: any) =>
              setValue("hackerExperience.hackerType", val, {
                shouldValidate: true,
              })
            }
            icon="🎨"
          />
          <RadioCard
            label="Multitasker"
            description="I love both designing and coding!"
            value="Multitasker"
            currentValue={currentType}
            onChange={(val: any) =>
              setValue("hackerExperience.hackerType", val, {
                shouldValidate: true,
              })
            }
            icon="🌟"
          />
          <RadioCard
            label="Other"
            description="I bring other unique skills to the table."
            value="Other"
            currentValue={currentType}
            onChange={(val: any) =>
              setValue("hackerExperience.hackerType", val, {
                shouldValidate: true,
              })
            }
            icon="✨"
          />
        </div>
        {he?.hackerType && (
          <p className="text-red-400 text-sm">{he.hackerType.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-bold text-white mb-2">
          What workshop are you interested in?{" "}
          <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
          {[
            "React/Vue.js",
            "Blockchain",
            "Machine Learning",
            "Android Development",
            "iOS Development",
            "Web Development",
            "Game Development",
            "Intro to AR/VR",
            "Hardware Hacking",
            "UX/UI Design",
            "Interview Prep",
          ].map((ws) => (
            <Checkbox
              key={ws}
              label={ws}
              value={ws}
              register={register}
              name="hackerExperience.workshops"
            />
          ))}
          <Checkbox
            label="Other"
            value="Other"
            register={register}
            name="hackerExperience.workshops"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-bold text-white mb-2">
          How did you hear about BearHacks?{" "}
          <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
          {[
            "MLH website",
            "Instagram",
            "Word of mouth",
            "Discord",
            "LinkedIn",
          ].map((ref) => (
            <Checkbox
              key={ref}
              label={ref}
              value={ref}
              register={register}
              name="hackerExperience.referral"
            />
          ))}
          <Checkbox
            label="Other"
            value="Other"
            register={register}
            name="hackerExperience.referral"
          />
        </div>
      </div>
    </div>
  );
};

export default StepExperience;
