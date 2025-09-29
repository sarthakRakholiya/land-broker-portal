"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  duration?: number;
}

const directionVariants = {
  up: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
  down: { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 } },
  left: { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 } },
  right: { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } },
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
};

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className,
  delay = 0,
  direction = "fade",
  duration = 0.6,
}) => {
  const variants = directionVariants[direction];

  return (
    <motion.div
      initial={variants.initial}
      animate={variants.animate}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};


