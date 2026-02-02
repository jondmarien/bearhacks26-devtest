import React from "react";
import { motion } from "framer-motion";

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
          animate={
            animate
              ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                  x: [0, 20, 0],
                }
              : {}
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] ${glowColor} rounded-full blur-[120px]`}
        />
      )}
      {showBottom && (
        <motion.div
          animate={
            animate
              ? {
                  scale: [1.2, 1, 1.2],
                  opacity: [0.3, 0.5, 0.3],
                  x: [0, -20, 0],
                }
              : {}
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] ${glowColor} rounded-full blur-[120px]`}
        />
      )}
    </div>
  );
};

export default GlowBackground;
