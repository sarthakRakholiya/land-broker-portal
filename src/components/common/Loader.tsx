import React from "react";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  className,
  text,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-2",
        className
      )}
    >
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};


