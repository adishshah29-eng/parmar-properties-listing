import Link from "next/link";
import { logout } from "./login/actions";
import { Home, Users, Building2, Key, Settings, LogOut, ArrowLeft } from "lucide-react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navLinks = [
    { href: "/admin", label: "Overview", icon: Home },
    { href: "/admin/developers", label: "Developers", icon: Users },
    { href: "/admin/projects", label: "Projects", icon: Building2 },
    { href: "/admin/inventory", label: "Inventory", icon: Key },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="w-64 bg-background/80 backdrop-blur-2xl border-r border-border/50 shadow-2xl flex flex-col z-20">
        <div className="p-8">
          <Link href="/" className="flex flex-col leading-none group">
            <span className="font-serif text-[17px] font-medium tracking-tight text-foreground transition-transform group-hover:scale-105 origin-left duration-300">PARMAR</span>
            <span className="text-[8px] tracking-[0.3em] uppercase text-muted-foreground font-sans mt-0.5">Admin Console</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 group"
            >
              <link.icon size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50 flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 group"
          >
            <ArrowLeft size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            Back to Public Site
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 group"
            >
              <LogOut size={16} className="text-muted-foreground group-hover:text-destructive transition-colors" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="p-8 md:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}