import React from "react";
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion";
import {
  STAGGER_CONTAINER_VARIANTS,
  SLIDE_UP_VARIANTS,
  SCALE_POP_VARIANTS,
} from "@/styles/animations";

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

/**
 * Standardized container for staggered reveals
 */
export const StaggerContainer: React.FC<MotionWrapperProps> = ({
  children,
  ...props
}) => (
  <motion.div
    variants={STAGGER_CONTAINER_VARIANTS}
    initial="hidden"
    animate="visible"
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * Standardized item for staggered reveals
 */
export const StaggerItem: React.FC<MotionWrapperProps> = ({
  children,
  ...props
}) => (
  <motion.div variants={SLIDE_UP_VARIANTS} {...props}>
    {children}
  </motion.div>
);

/**
 * Reusable spring hover effect for buttons and logos
 */
export const HoverSpring: React.FC<MotionWrapperProps> = ({
  children,
  ...props
}) => (
  <motion.div
    whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
    whileTap={{ scale: 0.95 }}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * Entrance wrapper for modals and cards
 */
export const EntranceScale: React.FC<MotionWrapperProps> = ({
  children,
  ...props
}) => (
  <motion.div
    variants={SCALE_POP_VARIANTS}
    initial="hidden"
    animate="visible"
    exit="hidden"
    {...props}
  >
    {children}
  </motion.div>
);

export { AnimatePresence };
