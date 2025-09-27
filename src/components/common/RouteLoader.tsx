"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export const RouteLoader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // Simulate route change loading
    handleStart();
    const timer = setTimeout(handleComplete, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-1 bg-primary-200 z-50"
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            exit={{ width: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full bg-primary-600"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
