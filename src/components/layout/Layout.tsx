import React from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={cn("w-full max-w-[1700px] mx-auto px-12 md:px-32 lg:px-40", className)}>
      {children}
    </div>
  );
};
