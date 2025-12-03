import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { RightSidebar } from "./right-sidebar";
import { BottomNav } from "./bottom-nav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex justify-center pb-14 sm:pb-0">
      <div className="flex w-full max-w-[1300px]">
        {/* Left Sidebar */}
        <header className="hidden sm:flex w-[80px] xl:w-[275px] flex-col h-screen sticky top-0 border-r border-border z-30">
          <Sidebar />
        </header>

        {/* Main Content */}
        <main className="flex-1 min-w-0 border-r border-border max-w-[600px]">
          {children}
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-[350px] pl-8 min-h-screen sticky top-0 h-screen overflow-y-auto py-2">
          <RightSidebar />
        </aside>
      </div>
      
      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
}
