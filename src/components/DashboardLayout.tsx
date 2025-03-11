
import { ReactNode } from "react";
import { NavigationBar } from "./NavigationBar";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className={`flex-1 p-3 md:p-6 overflow-y-auto ${isMobile ? 'pt-14' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
