
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NeumorphicCardProps {
  title: string;
  value: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function NeumorphicCard({ 
  title, 
  value, 
  icon, 
  trend, 
  className 
}: NeumorphicCardProps) {
  return (
    <div 
      className={cn(
        "bg-white rounded-xl p-6 shadow-[5px_5px_15px_#d9d9d9,-5px_-5px_15px_#ffffff] transition-all duration-300 hover:shadow-[8px_8px_20px_#d1d1d1,-8px_-8px_20px_#ffffff]",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && (
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
