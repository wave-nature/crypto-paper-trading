import React from "react";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: string;
}

const sizeMap = {
  xs: "w-3 h-3 border-[1.5px]",
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-[3px]",
  xl: "w-12 h-12 border-[3px]",
};

export default function Spinner({
  size = "md",
  className = "",
  color = "border-violet-500",
}: SpinnerProps) {
  return (
    <div
      className={`inline-block ${sizeMap[size]} border-solid rounded-full animate-spin border-t-transparent ${color} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
