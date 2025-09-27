"use client";

import React from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "./LoadingSpinner";

interface PageLoaderProps {
  isLoading: boolean;
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  isLoading,
  message = "Loading...",
}) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl shadow-strong p-8 flex flex-col items-center space-y-4"
      >
        <LoadingSpinner size="lg" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-primary-700 font-medium"
        >
          {message}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
