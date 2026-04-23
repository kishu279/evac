"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { LogOut, ShieldAlert, LayoutDashboard, CheckSquare, FileText } from "lucide-react";
import { usePathname } from "next/navigation";

export const getRoleColor = (role: string | null) => {
  switch (role) {
    case "admin":
      return "text-red-500 bg-red-500/10 border-red-500/20";
    case "security":
      return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    case "medical":
      return "text-green-500 bg-green-500/10 border-green-500/20";
    case "management":
      return "text-purple-500 bg-purple-500/10 border-purple-500/20";
    default:
      return "text-zinc-400 bg-zinc-800 border-zinc-700";
  }
};

export const Navbar = () => {
  const { currentUser, userRole, logout } = useAuth();
  const pathname = usePathname();

  if (!currentUser) return null;

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Trigger Alert", href: "/alert", icon: ShieldAlert },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Reports", href: "/report", icon: FileText },
  ];

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <ShieldAlert className="h-8 w-8 text-red-500" />
          <span className="text-xl font-bold tracking-wider text-white">EVAC</span>
        </Link>
        <div className="flex items-center gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {userRole && (
          <div className={`px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${getRoleColor(userRole)}`}>
            {userRole}
          </div>
        )}
        <div className="text-sm text-zinc-300">{currentUser.email}</div>
        <button
          onClick={logout}
          className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
};
