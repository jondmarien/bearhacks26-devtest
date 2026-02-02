import type { Variants, Transition } from "framer-motion";

// Transitions
export const SPRING_TRANSITION: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 15,
};

export const SOFT_SPRING_TRANSITION: Transition = {
  type: "spring",
  stiffness: 80,
  damping: 20,
};

export const HIGH_TENSION_SPRING: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

// Variants
export const FADE_IN_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const SLIDE_UP_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_TRANSITION,
  },
};

export const SCALE_POP_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: HIGH_TENSION_SPRING,
  },
};

export const STAGGER_CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const FLOATING_VARIANTS: Variants = {
  animate: {
    y: [0, -12, 0], // Back to basics: smooth sine wave
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const BREATHING_GLOW_VARIANTS: Variants = {
  animate: (custom: { reverse?: boolean } = {}) => ({
    scale: [1, 1.15, 1],
    opacity: [0.3, 0.5, 0.3],
    x: custom.reverse ? [0, -15, 0] : [0, 15, 0],
    transition: {
      duration: custom.reverse ? 12 : 10,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }),
};
