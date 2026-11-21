"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, LogOut } from "lucide-react";
import { authService } from "@/services/authService";

export const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Kelas Saya", href: "/kelas-saya" },
  { name: "Kehadiran", href: "/kehadiran" },
  { name: "Penilaian", href: "/penilaian" },
  { name: "AI Student Evaluator", href: "/evaluator" },
  { name: "Tugas", href: "/tugas" },
  { name: "Kalender Akademik", href: "/kalender" },
  { name: "Pengaturan", href: "/pengaturan" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      window.location.href = "/auth";
    }
  };

  return (
    <aside className="w-full md:w-64 bg-[#182B4E] text-white flex flex-col justify-between shrink-0 md:h-screen md:sticky md:top-0 md:overflow-y-auto relative z-20">
      <div>
        {/* Logo Brand */}
        <div className="p-6 flex items-center gap-3">
          <div className="relative w-10 h-8 flex items-center justify-center">
            <div className="absolute -top-1 w-3 h-3 bg-orange-400 rounded-full blur-[0.5px]" />
            <svg className="w-10 h-8 text-[#0066FF] fill-current" viewBox="0 0 24 24">
              <path d="M12 4.5C10 3.2 7 3 4 3 2.5 3 1.5 3.5 1 4v14.5c.5-.5 1.5-1 3-1 3 0 6 .2 8 1.5 2-1.3 5-1.5 8-1.5 1.5 0 2.5.5 3 1V4c-.5-.5-1.5-1-3-1-3 0-6 .2-8 1.5z" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            EduInsight
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="px-4 space-y-1.5 text-sm font-medium">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#3B6DB3] text-white font-semibold shadow-sm"
                    : "text-slate-200 hover:bg-blue-900/50 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Status & Logout */}
      <div className="p-4 space-y-2">
        <div className="bg-[#122240] p-3 rounded-xl flex items-center gap-3 border border-slate-700/40">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-white">Sistem Aktif</div>
            <div className="text-[10px] text-slate-300">Versi 1.0.4-LMS</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 rounded-xl transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
}
