import React from "react";
import { motion } from "framer-motion";
import { BREATHING_GLOW_VARIANTS } from "@/styles/animations";

interface GlowBackgroundProps {
  color?: "purple" | "blue" | "red";
  position?: "top" | "bottom" | "both";
  className?: string;
  animate?: boolean;
}

const GlowBackground: React.FC<GlowBackgroundProps> = ({
  color = "purple",
  position = "both",
  className = "",
  animate = true,
}) => {
  const colorMap = {
    purple: "bg-purple-600/20",
    blue: "bg-blue-600/20",
    red: "bg-red-600/10",
  };

  const showTop = position === "top" || position === "both";
  const showBottom = position === "bottom" || position === "both";
  const glowColor = colorMap[color];

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}
    >
      {showTop && (
        <motion.div
          variants={BREATHING_GLOW_VARIANTS}
          custom={{ reverse: false }}
          animate={animate ? "animate" : ""}
          className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] ${glowColor} rounded-full blur-[120px]`}
        />
      )}
      {showBottom && (
        <motion.div
          variants={BREATHING_GLOW_VARIANTS}
          custom={{ reverse: true }}
          animate={animate ? "animate" : ""}
          className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] ${glowColor} rounded-full blur-[120px]`}
        />
      )}
    </div>
  );
};

export default GlowBackground;
