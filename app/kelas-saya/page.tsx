"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function KelasSayaPage() {
  const { theme, setTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const pathname = usePathname();

  // State Data Kelas dari Backend Database
  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // State User Profil dari LocalStorage
  const [user, setUser] = useState<any>(null);

  // 1. READ: Tarik data kelas dari API Backend
  const fetchClasses = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await apiFetch("/classes", { method: "GET" });
      setMyClasses(Array.isArray(data) ? data : data.data || []);
    } catch (err: any) {
      console.error("Gagal mengambil data kelas:", err);
      setErrorMsg(err.message || "Gagal memuat data kelas dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {}
    }
  }, []);

  // 3. DELETE: Hapus kelas dari Backend Database
  const handleDeleteClass = async (id: string, className: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kelas "${className}"?`)) return;

    try {
      await apiFetch(`/classes/${id}`, { method: "DELETE" });
      fetchClasses(); // Refresh data setelah dihapus
    } catch (err: any) {
      alert(err.message || "Gagal menghapus kelas");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white flex flex-col md:flex-row font-sans transition-colors duration-200">
      
      {/* ---------------- SIDEBAR LEFT ---------------- */}
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

        {/* Footer Sidebar & Theme Switcher */}
        <div className="p-6 relative">
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
        </div>
      </aside>

      {/* TOP HEADER BAR & MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-black transition-colors duration-200">
        
        {/* TOP HEADER BAR */}
        <header className="h-20 bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between shrink-0">
          <h1 className="text-xl md:text-2xl font-bold text-black dark:text-white tracking-tight">
            Semester Ganjil 2026/2027
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-bold text-black dark:text-white leading-tight">
                {user?.name || user?.nama || "Dosen Pengampu"}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {user?.fakultas || "Fakultas Vokasi"}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#182B4E] text-white flex items-center justify-center font-bold text-base shadow-sm">
              {(user?.name || user?.nama || "D").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* CONTENT KELAS SAYA */}
        <div className="p-8 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Manajemen Perkuliahan
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                Kelas Saya
              </h2>
            </div>
          </div>

          {/* Skenario Loading */}
          {loading && (
            <div className="flex items-center gap-3 py-12 justify-center text-slate-500 dark:text-slate-400 text-sm font-medium">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memuat data kelas dari database backend...</span>
            </div>
          )}

          {/* Skenario Error / Kosong */}
          {!loading && errorMsg && (
            <div className="p-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium">
              {errorMsg}
            </div>
          )}

          {!loading && !errorMsg && myClasses.length === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
              Belum ada data kelas di database.
            </div>
          )}

          {/* GRID KELAS SAYA (READ FROM DATABASE & DELETE) */}
          {!loading && myClasses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myClasses.map((item: any) => {
                const itemId = item._id || item.id;
                return (
                  <div
                    key={itemId}
                    className="bg-[#CBE0FE] p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm relative group"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          {item.code || "KELAS"}
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-lime-400 text-slate-900">
                          75% selesai
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-2">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-700 font-medium mt-1">
                        {item.classRoom || "Kelas Umum"}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {item.schedule || "Jadwal belum diatur"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Link
                        href="/kehadiran"
                        className="w-fit px-5 py-2.5 rounded-xl bg-[#294371] hover:bg-blue-900 text-white font-semibold text-xs shadow-sm transition-all text-center cursor-pointer"
                      >
                        Buka Kelas
                      </Link>

                      {/* Tombol Hapus Kelas (Delete) */}
                      <button
                        onClick={() => handleDeleteClass(itemId, item.name || "Kelas")}
                        className="p-2 rounded-xl text-red-600 hover:bg-red-200/60 transition-all cursor-pointer"
                        title="Hapus Kelas"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

    </div>
  );
}