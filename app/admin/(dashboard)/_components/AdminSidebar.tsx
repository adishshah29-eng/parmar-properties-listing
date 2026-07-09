"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "../../login/actions";
import { Home, Users, Building2, Key, Settings, LogOut, ArrowLeft, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navLinks = [
    { href: "/admin", label: "Overview", icon: Home },
    { href: "/admin/developers", label: "Developers", icon: Users },
    { href: "/admin/projects", label: "Projects", icon: Building2 },
    { href: "/admin/inventory", label: "Inventory", icon: Key },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside 
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-background/80 backdrop-blur-2xl border-r border-border/50 shadow-2xl flex flex-col z-20 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] relative group`}
    >
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-110 shadow-sm transition-all duration-300 z-30"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={`p-8 ${isCollapsed ? "px-4 flex justify-center" : ""}`}>
        <Link href="/" className="flex flex-col leading-none group">
          <span className="font-serif text-[17px] font-medium tracking-tight text-foreground transition-transform group-hover:scale-105 origin-left duration-300 flex items-center gap-2">
            {!isCollapsed ? (
              <>PARMAR</>
            ) : (
              <span className="text-xl">P</span>
            )}
          </span>
          {!isCollapsed && <span className="text-[8px] tracking-[0.3em] uppercase text-muted-foreground font-sans mt-0.5 whitespace-nowrap">Admin Console</span>}
        </Link>
      </div>

      <nav className={`flex-1 px-4 py-4 flex flex-col gap-2 ${isCollapsed ? "items-center" : ""}`}>
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              title={isCollapsed ? link.label : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              } ${isCollapsed ? "justify-center px-3" : ""}`}
            >
              <link.icon size={16} className={isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary transition-colors"} />
              {!isCollapsed && <span>{link.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className={`p-4 border-t border-border/50 flex flex-col gap-2 ${isCollapsed ? "items-center" : ""}`}>
        <Link
          href="/"
          title={isCollapsed ? "Back to Public Site" : undefined}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 group ${isCollapsed ? "justify-center px-3" : ""}`}
        >
          <ArrowLeft size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          {!isCollapsed && <span className="whitespace-nowrap">Back to Public Site</span>}
        </Link>

        <form action={logout} className="w-full">
          <button
            type="submit"
            title={isCollapsed ? "Sign Out" : undefined}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 group ${isCollapsed ? "justify-center px-3" : ""}`}
          >
            <LogOut size={16} className="text-muted-foreground group-hover:text-destructive transition-colors" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
