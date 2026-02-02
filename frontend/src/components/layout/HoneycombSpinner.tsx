import React from "react";
import { motion } from "framer-motion";

const HoneycombSpinner: React.FC = () => {
  // Hexagon points for a simple SVG polygon
  const hexPoints = "25,5 45,15 45,35 25,45 5,35 5,15";

  // Honeycomb arrangement
  const hexagons = [
    { x: 0, y: -20, delay: 0 },
    { x: -18, y: 10, delay: 0.2 },
    { x: 18, y: 10, delay: 0.4 },
  ];

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {hexagons.map((hex, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 50 50"
          className="absolute w-12 h-12"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.1, 0.8],
            x: hex.x,
            y: hex.y,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: hex.delay,
            ease: "easeInOut",
          }}
        >
          <defs>
            <linearGradient
              id={`grad-${i}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
          <polygon
            points={hexPoints}
            fill={`url(#grad-${i})`}
            className="drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
          />
        </motion.svg>
      ))}
    </div>
  );
};

export default HoneycombSpinner;
