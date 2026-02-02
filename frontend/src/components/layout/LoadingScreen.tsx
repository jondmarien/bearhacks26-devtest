import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlowBackground from "@/components/layout/GlowBackground";
import HoneycombSpinner from "@/components/layout/HoneycombSpinner";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950 overflow-hidden font-primary"
      >
        <GlowBackground animate={true} />

        <div className="relative z-10 flex flex-col items-center gap-8">
          <HoneycombSpinner />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl font-medium tracking-widest text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400 uppercase"
          >
            {message}
          </motion.p>

          <motion.div
            className="absolute -bottom-24 w-64 h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent"
            animate={{
              scaleX: [0.2, 1, 0.2],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
