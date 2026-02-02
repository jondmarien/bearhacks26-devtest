import React from "react";
import { motion } from "framer-motion";

interface WizardNavigationProps {
  onBack: () => void;
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  onBack,
  onNext,
  isFirstStep,
  isLastStep,
  canProceed,
}) => {
  return (
    <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-800/50">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep}
        className={`text-sm font-bold uppercase tracking-wider transition-colors ${
          isFirstStep
            ? "text-gray-600 cursor-not-allowed"
            : "text-gray-400 hover:text-white"
        }`}
      >
        Back
      </button>

      <motion.button
        type="button"
        onClick={onNext}
        disabled={!canProceed}
        whileHover={canProceed ? { scale: 1.05 } : {}}
        whileTap={canProceed ? { scale: 0.95 } : {}}
        className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
          canProceed
            ? isLastStep
              ? "bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-emerald-500/20"
              : "bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-blue-500/20"
            : "bg-gray-800 text-gray-500 cursor-not-allowed shadow-none"
        }`}
      >
        {isLastStep ? "Submit Application" : "Next"}
      </motion.button>
    </div>
  );
};

export default WizardNavigation;
