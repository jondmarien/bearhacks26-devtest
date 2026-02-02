import React from "react";

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
  const pulseClass = animate ? "animate-pulse" : "";

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}
    >
      {showTop && (
        <div
          className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] ${glowColor} rounded-full blur-[120px] ${pulseClass}`}
        />
      )}
      {showBottom && (
        <div
          className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] ${glowColor} rounded-full blur-[120px] ${pulseClass} delay-700`}
        />
      )}
    </div>
  );
};

export default GlowBackground;
