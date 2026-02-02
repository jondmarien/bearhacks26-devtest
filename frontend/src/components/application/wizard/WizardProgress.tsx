import React from "react";
import { motion } from "framer-motion";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

const HexagonPath = "M12 2L21.5 7.5V18.5L12 24L2.5 18.5V7.5L12 2Z";

const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="flex gap-3 justify-center w-full mb-8">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isActive = i <= currentStep;
        const isCurrent = i === currentStep;

        return (
          <div
            key={i}
            className="relative w-8 h-8 flex items-center justify-center"
          >
            {/* Background Hex */}
            <svg
              viewBox="0 0 24 26"
              className={`w-full h-full transition-colors duration-500 ${
                isActive ? "text-purple-500/20" : "text-gray-800"
              }`}
              fill="currentColor"
            >
              <path d={HexagonPath} />
            </svg>

            {/* Active Hex Overlay */}
            {isActive && (
              <motion.svg
                viewBox="0 0 24 26"
                className="absolute inset-0 w-full h-full text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <path d={HexagonPath} fill="currentColor" />
              </motion.svg>
            )}

            {/* Current Step Pulsing Glow */}
            {isCurrent && (
              <motion.div
                className="absolute inset-0 bg-purple-400 blur-md rounded-full -z-10"
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Step Number */}
            <span
              className={`absolute text-[10px] font-bold ${isActive ? "text-gray-900" : "text-gray-600"} pointer-events-none`}
            >
              {i + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default WizardProgress;
