import { cn } from "@/lib/utils";
import React from "react";

interface SpinnerProps {
  loading: boolean;
  className?: string;
}
export const Spinner = ({ loading, className }: SpinnerProps) => {
  return (
    <div
      className={cn(
        "animate-spin w-6 h-6 border-4 border-gray-300 border-t-black rounded-full",
        className
      )}
    ></div>
  );
};
