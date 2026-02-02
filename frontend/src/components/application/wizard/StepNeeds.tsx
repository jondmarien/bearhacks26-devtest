import React from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import type { ApplicationData } from "@shared/schemas/application";
import { motion } from "framer-motion";

interface StepProps {
  register: UseFormRegister<ApplicationData>;
  errors: FieldErrors<ApplicationData>;
  watch: UseFormWatch<ApplicationData>;
  setValue: UseFormSetValue<ApplicationData>;
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

const StepNeeds: React.FC<StepProps> = ({
  register,
  errors,
  watch,
  setValue,
}) => {
  const an = errors.additionalNeeds;
  const currentDietary = watch("additionalNeeds.dietary") || [];

  const toggleDietary = (diet: string) => {
    if (diet === "None") {
      setValue("additionalNeeds.dietary", ["None"], { shouldValidate: true });
      return;
    }

    let newDietary = currentDietary.filter((d) => d !== "None");
    if (newDietary.includes(diet)) {
      newDietary = newDietary.filter((d) => d !== diet);
    } else {
      newDietary.push(diet);
    }
    setValue("additionalNeeds.dietary", newDietary, { shouldValidate: true });
  };

  const dietaryOptions = [
    "None",
    "Vegetarian",
    "Vegan",
    "Gluten-free",
    "Halal",
    "Kosher",
    "Nut-allergy",
    "Lactose intolerant",
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl"
        >
          🍎
        </motion.div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-orange-300 to-amber-400 font-display">
          Additional Needs
        </h2>
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-bold text-white mb-2">
          Do you have any dietary restrictions/allergies?{" "}
          <span className="text-pink-400">✦</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {dietaryOptions.map((diet) => (
            <Pill
              key={diet}
              label={diet}
              value={diet}
              selected={currentDietary.includes(diet)}
              onClick={() => toggleDietary(diet)}
            />
          ))}
        </div>
        {an?.dietary && (
          <p className="text-red-400 text-sm">{an.dietary.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-gray-300">
          Other (please specify)
        </label>
        <input
          {...register("additionalNeeds.dietaryOther")}
          placeholder="ie. shellfish free"
          className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-orange-400 outline-hidden transition-all"
        />
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-800">
        <label className="block text-lg font-bold text-white mb-2">
          Any accessibility needs or accommodations you'd like to request?{" "}
          <span className="text-pink-400">✦</span>
        </label>
        <textarea
          {...register("additionalNeeds.accessibility")}
          placeholder="Please describe any accessibility needs or accommodations..."
          className="w-full h-32 bg-gray-900/50 border-2 border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-orange-400 outline-hidden transition-all resize-none"
        />
      </div>
      {/* Decorative Mascot */}
      <motion.div
        className="absolute -right-10 bottom-20 opacity-80 pointer-events-none hidden md:block"
        animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Placeholder for the ghost-like pointing cursor mascot from the design */}
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 80L80 50L20 20V80Z"
            fill="#E2E8F0"
            stroke="#94A3B8"
            strokeWidth="2"
          />
          <circle cx="35" cy="40" r="2" fill="#1E293B" />
          <circle cx="35" cy="60" r="2" fill="#1E293B" />
          <path
            d="M45 50H55"
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default StepNeeds;
