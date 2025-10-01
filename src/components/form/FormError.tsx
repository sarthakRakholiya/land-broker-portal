import React from "react";
import { cn } from "@/utils/cn";

interface FormErrorProps {
  message?: string;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message, className }) => {
  if (!message) return null;

  return (
    <p
      className={cn(
        "text-sm text-error-600 dark:text-error-400 mt-1",
        className
      )}
    >
      {message}
    </p>
  );
};




