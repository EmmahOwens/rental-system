
import { cn } from "@/lib/utils";

interface NeumorphicCardProps {
  children: React.ReactNode;
  className?: string;
  inset?: boolean;
}

export function NeumorphicCard({ 
  children, 
  className,
  inset = false
}: NeumorphicCardProps) {
  return (
    <div className={cn(
      inset ? "neumorph-inset" : "neumorph-card", 
      className
    )}>
      {children}
    </div>
  );
}
