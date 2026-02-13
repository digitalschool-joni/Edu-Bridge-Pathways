import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  BookOpen, 
  Smile, 
  GraduationCap, 
  Building2, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const resetData = useStore(state => state.resetData);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "Diagnostic", href: "/diagnostic" },
    { icon: Smile, label: "Mood Tracker", href: "/mood" },
    { icon: GraduationCap, label: "Career Path", href: "/career" },
    { icon: Building2, label: "Universities", href: "/universities" },
    { icon: Users, label: "Alumni Network", href: "/alumni" },
    { icon: Settings, label: "Final Assessment", href: "/final-survey" },
  ];

  const handleReset = () => {
    if (confirm("Are you sure you want to clear all demo data?")) {
      resetData();
      window.location.reload();
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#011f4b] text-white">
      <div className="p-6 border-b border-[#03396c]">
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-[#6497b1]" />
          EduBridge
        </h1>
        <p className="text-xs text-blue-200 mt-1 uppercase tracking-wider">Pathways</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-[#005b96] text-white shadow-lg shadow-black/20 font-medium" 
                : "text-blue-200 hover:bg-[#03396c] hover:text-white"
            )}>
              <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-[#6497b1] group-hover:text-white")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-[#03396c]">
        <div className="bg-[#03396c]/50 rounded-xl p-4 mb-4">
          <p className="text-xs text-blue-200 mb-2">Student Profile</p>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#6497b1] flex items-center justify-center text-[#011f4b] font-bold">
              JD
            </div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-blue-300">Grade 11</p>
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-900/20"
          onClick={handleReset}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Reset Demo
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 fixed h-full z-30 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#011f4b] z-40 flex items-center justify-between px-4 shadow-md">
        <span className="font-display font-bold text-white text-xl">EduBridge</span>
        <Button size="icon" variant="ghost" className="text-white" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          {isMobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="md:hidden fixed inset-0 z-30 bg-[#011f4b] pt-16"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
