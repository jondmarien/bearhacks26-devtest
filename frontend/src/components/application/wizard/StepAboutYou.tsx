import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ApplicationData } from "@shared/schemas/application";
import { motion } from "framer-motion";

interface StepProps {
  register: UseFormRegister<ApplicationData>;
  errors: FieldErrors<ApplicationData>;
}

const InputField = ({
  label,
  name,
  register,
  error,
  placeholder,
  type = "text",
}: any) => (
  <div className="space-y-1.5 basis-1/2">
    <label className="text-sm font-bold text-gray-300 ml-1">
      {label} <span className="text-red-400">*</span>
    </label>
    <div className="relative group">
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={`w-full bg-gray-900/50 border-2 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-hidden transition-all duration-300 ${
          error
            ? "border-red-500/50 focus:border-red-500"
            : "border-gray-700 group-hover:border-gray-600 focus:border-purple-500"
        }`}
      />
      {error && (
        <span className="absolute right-3 top-3 text-red-500 text-xs font-bold">
          !
        </span>
      )}
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="text-red-400 text-xs ml-1"
      >
        {error.message}
      </motion.p>
    )}
  </div>
);

const StepAboutYou: React.FC<StepProps> = ({ register, errors }) => {
  const bi = errors.basicInfo;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="text-4xl"
        >
          🌟
        </motion.div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-green-300 to-emerald-400 font-display">
          About You
        </h2>
      </div>

      <div className="flex gap-4">
        <InputField
          label="First Name"
          name="basicInfo.firstName"
          register={register}
          error={bi?.firstName}
          placeholder="e.g. Cersei"
        />
        <InputField
          label="Last Name"
          name="basicInfo.lastName"
          register={register}
          error={bi?.lastName}
          placeholder="e.g. Lannister"
        />
      </div>

      <div className="flex gap-4">
        <InputField
          label="Email"
          name="basicInfo.email"
          register={register}
          error={bi?.email}
          placeholder="your@email.com"
          type="email"
        />
        <InputField
          label="Phone Number"
          name="basicInfo.phone"
          register={register}
          error={bi?.phone}
          placeholder="123-456-7890"
          type="tel"
        />
      </div>

      <div className="flex gap-4">
        <InputField
          label="City"
          name="basicInfo.city"
          register={register}
          error={bi?.city}
          placeholder="e.g. Toronto"
        />
        <InputField
          label="Country"
          name="basicInfo.country"
          register={register}
          error={bi?.country}
          placeholder="e.g. Canada"
        />
      </div>

      <div className="flex gap-4">
        <InputField
          label="Post Secondary School"
          name="basicInfo.school"
          register={register}
          error={bi?.school}
          placeholder="Start typing..."
        />
        <InputField
          label="Year to graduate"
          name="basicInfo.year"
          register={register}
          error={bi?.year}
          placeholder="2026"
        />
      </div>

      <div className="flex gap-4">
        <InputField
          label="Program Major"
          name="basicInfo.major"
          register={register}
          error={bi?.major}
          placeholder="e.g. Computer Science"
        />
        <InputField
          label="Education Level"
          name="basicInfo.educationLevel"
          register={register}
          error={bi?.educationLevel}
          placeholder="e.g. Undergraduate"
        />
      </div>

      <div className="flex gap-4">
        <InputField
          label="Age (as of Jan 16, 2026)"
          name="basicInfo.age"
          type="number"
          register={register}
          error={bi?.age}
          placeholder="18"
        />
        <InputField
          label="Discord Username"
          name="basicInfo.discord"
          register={register}
          error={bi?.discord}
          placeholder="username#1234 (optional)"
        />
      </div>

      <div className="text-xs text-gray-500 mt-4 text-center">
        You must be a high school graduate and at least 18 years old or above to
        attend BearHacks.
      </div>
    </div>
  );
};

export default StepAboutYou;
