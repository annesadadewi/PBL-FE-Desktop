"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, CheckCircle2, BookOpen, Users, FileEdit, TrendingUp, LogOut } from "lucide-react";
import { apiFetch } from "@/lib/api"; //[cite: 2]

export default function DashboardPage() {
  const { theme, setTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // State User Profil dari LocalStorage
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fungsi Logout
  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" }); //
    } catch (err) {
      console.error("Gagal logout di server:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/"); // Kembali ke halaman login
    }
  };

  // Data Kelas Aktif
  const activeClasses = [
    {
      id: "PFA3",
      name: "Pemrograman Framework",
      classCode: "Kelas A",
      students: "30 Mahasiswa",
      schedule: "10.20-13.00",
      progress: "75% selesai",
      progressBg: "bg-lime-400 text-slate-900",
    },
    {
      id: "MD3",
      name: "Mobile",
      classCode: "Kelas D",
      students: "32 Mahasiswa",
      schedule: "10.20-13.00",
      progress: "82% selesai",
      progressBg: "bg-lime-300 text-slate-900",
    },
    {
      id: "KBC3",
      name: "Kecerdasan Buatan",
      classCode: "Kelas C",
      students: "24 Mahasiswa",
      schedule: "14.40-16.30",
      progress: "80% selesai",
      progressBg: "bg-lime-300 text-slate-900",
    },
    {
      id: "M20",
      name: "Jaringan Komputer",
      classCode: "Kelas D",
      students: "30 Mahasiswa",
      schedule: "10.25-12.00",
      progress: "56% selesai",
      progressBg: "bg-yellow-300 text-slate-900",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white flex flex-col md:flex-row font-sans transition-colors duration-200">
      
      {/* ---------------- SIDEBAR LEFT ---------------- */}
      <aside className="w-full md:w-64 bg-[#182B4E] text-white flex flex-col justify-between shrink-0 min-h-screen relative z-20">
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
            <Link
              href="/dashboard"
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                pathname === "/dashboard"
                  ? "bg-[#3B6DB3] text-white font-semibold shadow-sm"
                  : "text-slate-200 hover:bg-blue-900/50 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/kelas-saya"
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                pathname === "/kelas-saya"
                  ? "bg-[#3B6DB3] text-white font-semibold shadow-sm"
                  : "text-slate-200 hover:bg-blue-900/50 hover:text-white"
              }`}
            >
              Kelas Saya
            </Link>
            <Link
              href="/kehadiran"
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                pathname === "/kehadiran"
                  ? "bg-[#3B6DB3] text-white font-semibold shadow-sm"
                  : "text-slate-200 hover:bg-blue-900/50 hover:text-white"
              }`}
            >
              Kehadiran
            </Link>
            <Link
              href="/penilaian"
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                pathname === "/penilaian"
                  ? "bg-[#3B6DB3] text-white font-semibold shadow-sm"
                  : "text-slate-200 hover:bg-blue-900/50 hover:text-white"
              }`}
            >
              Penilaian
            </Link>
            <Link
              href="/evaluator"
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                pathname === "/evaluator"
                  ? "bg-[#3B6DB3] text-white font-semibold shadow-sm"
                  : "text-slate-200 hover:bg-blue-900/50 hover:text-white"
              }`}
            >
              AI Student Evaluator
            </Link>
            <Link
              href="/tugas"
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                pathname === "/tugas"
                  ? "bg-[#3B6DB3] text-white font-semibold shadow-sm"
                  : "text-slate-200 hover:bg-blue-900/50 hover:text-white"
              }`}
            >
              Tugas
            </Link>
            <Link
              href="/kalender"
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                pathname === "/kalender"
                  ? "bg-[#3B6DB3] text-white font-semibold shadow-sm"
                  : "text-slate-200 hover:bg-blue-900/50 hover:text-white"
              }`}
            >
              Kalender Akademik
            </Link>
            <Link
              href="/pengaturan"
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                pathname === "/pengaturan"
                  ? "bg-[#3B6DB3] text-white font-semibold shadow-sm"
                  : "text-slate-200 hover:bg-blue-900/50 hover:text-white"
              }`}
            >
              Pengaturan
            </Link>
          </nav>
        </div>

        {/* Footer Sidebar, Theme Switcher & Logout */}
        <div className="p-6 relative flex items-center justify-between">
          {showThemeMenu && (
            <div className="absolute bottom-16 left-6 w-48 bg-[#CBE0FE] text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-blue-200 p-1.5 space-y-1 z-30 transition-all">
              <button
                type="button"
                onClick={() => {
                  setTheme("light");
                  setShowThemeMenu(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  theme === "light"
                    ? "bg-[#3B6DB3] text-white shadow-sm"
                    : "hover:bg-blue-200/60 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sun className="w-4 h-4" />
                  <span>Light</span>
                </div>
                {theme === "light" && <CheckCircle2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme("dark");
                  setShowThemeMenu(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  theme === "dark"
                    ? "bg-[#3B6DB3] text-white shadow-sm"
                    : "hover:bg-blue-200/60 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Moon className="w-4 h-4" />
                  <span>Dark</span>
                </div>
                {theme === "dark" && <CheckCircle2 className="w-4 h-4" />}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-blue-900/50 transition-all focus:outline-none cursor-pointer"
            aria-label="Toggle Theme Menu"
          >
            <Sun className="w-6 h-6" />
          </button>

          {/* Tombol Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-2.5 rounded-xl text-red-300 hover:text-red-100 hover:bg-red-500/20 transition-all focus:outline-none cursor-pointer flex items-center gap-2"
            title="Keluar / Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT AREA ---------------- */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-black transition-colors duration-200">
        
        {/* TOP HEADER BAR */}
        <header className="h-20 bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between shrink-0">
          <h1 className="text-xl md:text-2xl font-bold text-black dark:text-white tracking-tight">
            Semester Ganjil 2026/2027
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-bold text-black dark:text-white leading-tight">
                {user?.nama || "Mister Potato"}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {user?.role ? `Role: ${user.role}` : "Fakultas Vokasi"}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#182B4E] text-white flex items-center justify-center font-bold text-base shadow-sm">
              {(user?.nama || "M").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="p-8 space-y-6 overflow-y-auto">
          
          {/* WELCOME BANNER & INPUT KEHADIRAN BUTTON */}
          <div className="bg-[#CBE0FE] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Selamat Datang, {user?.nama || "Mister Potato"}!
              </h2>
              <p className="text-xs md:text-sm text-slate-700 mt-1 font-medium">
                Pantau Aktivitas perkuliahan dan tindak lanjut mahasiswa Anda hari ini
              </p>
            </div>

            <Link
              href="/kehadiran"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#294371] hover:bg-blue-900 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
            >
              Input Kehadiran
            </Link>
          </div>

          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card 1: Kelas Aktif */}
            <div className="bg-[#CBE0FE] p-5 rounded-2xl shadow-sm flex flex-col justify-between h-32 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Kelas Aktif</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">04</div>
            </div>

            {/* Card 2: Total Mahasiswa */}
            <div className="bg-[#CBE0FE] p-5 rounded-2xl shadow-sm flex flex-col justify-between h-32 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Total Mahasiswa</span>
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">84</div>
            </div>

            {/* Card 3: Perlu Dinilai */}
            <div className="bg-[#CBE0FE] p-5 rounded-2xl shadow-sm flex flex-col justify-between h-32 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Perlu Dinilai</span>
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                  <FileEdit className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">18</div>
            </div>

            {/* Card 4: Kehadiran Rata-Rata */}
            <div className="bg-[#CBE0FE] p-5 rounded-2xl shadow-sm flex flex-col justify-between h-32 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Kehadiran Rata-Rata</span>
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">89%</div>
            </div>
          </div>

          {/* BOTTOM SECTION: KELAS AKTIF & AKTIVITAS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* KELAS AKTIF CARDS */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-black dark:text-white">
                  Kelas Aktif
                </h3>
                <Link
                  href="/kelas-saya"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Lihat Semua Kelas
                </Link>
              </div>

              {/* GRID KELAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeClasses.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#CBE0FE] p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          {item.id}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${item.progressBg}`}>
                          {item.progress}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-2">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-700 font-medium">
                        {item.classCode}
                      </p>
                      <p className="text-xs text-slate-700 font-medium mt-1">
                        {item.students}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Rabu {item.schedule}
                      </p>
                    </div>

                    <Link
                      href="/kehadiran"
                      className="w-fit px-5 py-2.5 rounded-xl bg-[#294371] hover:bg-blue-900 text-white font-semibold text-xs shadow-sm transition-all text-center cursor-pointer"
                    >
                      Buka Kelas
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* AKTIVITAS PANEL */}
            <div className="bg-[#182B4E] text-white p-6 rounded-2xl shadow-md space-y-4">
              
              {/* Header Section */}
              <div>
                <h3 className="text-xl font-bold text-[#E6EEF8] tracking-tight">
                  Aktivitas
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Prioritas Minggu Ini
                </p>
              </div>

              {/* Activity Items List */}
              <div className="space-y-4">
                
                {/* Item 1: Penilaian UTS */}
                <div className="border-l-2 border-slate-500/60 pl-4 space-y-0.5">
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    Penilaian UTS
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    18 respons mahasiswa masih menunggu penilaian
                  </p>
                </div>

                {/* Item 2: Tenggat Tugas Mendekat */}
                <div className="border-l-2 border-slate-500/60 pl-4 space-y-0.5">
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    Tenggat Tugas Mendekat
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Proyek Klasifikasi Data berakhir dalam 7 hari.
                  </p>
                </div>

                {/* Item 3: Penilaian Tugas */}
                <div className="border-l-2 border-slate-500/60 pl-4 space-y-0.5">
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    Penilaian Tugas
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    6 respons mahasiswa masih menunggu penilaian
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}