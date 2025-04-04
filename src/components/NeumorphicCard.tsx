
import React from 'react';
import { cn } from "@/lib/utils";

export interface NeumorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function NeumorphicCard({ children, className, ...props }: NeumorphicCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-background shadow-[0.5rem_0.5rem_1rem_rgba(0,0,0,0.05),-0.5rem_-0.5rem_1rem_rgba(255,255,255,0.8)] border border-neutral-100/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
