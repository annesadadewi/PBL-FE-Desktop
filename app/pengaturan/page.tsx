"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon,CheckCircle2 } from "lucide-react";
import { useTheme } from "next-themes";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Kelas Saya", href: "/kelas-saya" },
  { name: "Kehadiran", href: "/kehadiran" },
  { name: "Penilaian", href: "/penilaian" },
  { name: "AI Student Evaluator", href: "/evaluator" },
  { name: "Tugas", href: "/tugas" },
  { name: "Kalender Akademik", href: "/kalender" },
  { name: "Pengaturan", href: "/pengaturan" },
];

export default function PengaturanPage() {
  const { theme, setTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // State Tab Aktif
  const [activeTab, setActiveTab] = useState<
    "profil" | "preferensi-ai" | "keamanan"
  >("profil");

  // Form States
  const [profileData] = useState({
    fullName: "Dr. Hieronimus Lekiuk, S.Tr., M.H",
    nip: "1987XXXXXXXXXX",
    phone: "08XXXXXXXXXX",
    title: "Doktor",
    email: "hieronimus@ub.ac.id",
    department: "Teknik Komputer",
    position: "Kepala Prodi",
  });

  const [aiSettings, setAiSettings] = useState({
    attendanceThreshold: "80%",
    gradeThreshold: "85",
    languageStyle: "Supportif & Edukatif",
    sentencePreview:
      "Mahasiswa menunjukkan progres yang baik. Pertahankan konsistensi belajar dan kehadiran.",
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotification: true,
    systemNotification: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-black text-slate-900 dark:text-white overflow-hidden font-sans transition-colors duration-200">
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

      {/* AREA UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-black text-slate-900 dark:text-white transition-colors duration-200">
        {/* 2. HEADER ATAS */}
           <header className="h-20 bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between shrink-0">
          <h1 className="text-xl md:text-2xl font-bold text-black dark:text-white tracking-tight">
            Semester Ganjil 2026/2027
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-bold text-black dark:text-white leading-tight">
                Mister Potato
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Fakultas Vokasi
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#182B4E] text-white flex items-center justify-center font-bold text-base shadow-sm">
              M
            </div>
          </div>
        </header>


        {/* 3. KONTEN UTAMA PENGATURAN */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6 bg-white dark:bg-black">
          {/* Header Judul */}
          <div>
            <p className="text-sm font-normal text-slate-600 dark:text-slate-400">
              Preferensi Portal
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              Pengaturan Akun & Sistem
            </h1>
          </div>

          {/* Tab Bar Navigasi Inner */}
          <div className="bg-[#C2D9FF] p-1.5 rounded-2xl flex items-center gap-2 text-xs font-bold text-slate-800">
            <button
              onClick={() => setActiveTab("profil")}
              className={`px-6 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "profil"
                  ? "bg-[#2B4B7C] text-white shadow-md"
                  : "hover:bg-blue-200/50 text-slate-800"
              }`}
            >
              Profil Saya
            </button>
            <button
              onClick={() => setActiveTab("preferensi-ai")}
              className={`px-6 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "preferensi-ai"
                  ? "bg-[#2B4B7C] text-white shadow-md"
                  : "hover:bg-blue-200/50 text-slate-800"
              }`}
            >
              Preferensi AI
            </button>
            <button
              onClick={() => setActiveTab("keamanan")}
              className={`px-6 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "keamanan"
                  ? "bg-[#2B4B7C] text-white shadow-md"
                  : "hover:bg-blue-200/50 text-slate-800"
              }`}
            >
              Keamanan & Notifikasi
            </button>
          </div>

          {/* TAB 1: PROFIL SAYA */}
          {activeTab === "profil" && (
            <div className="bg-[#C2D9FF] p-6 rounded-2xl shadow-xs text-slate-900 space-y-4">
              <h3 className="text-sm font-bold text-slate-950">Profil Saya</h3>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Placeholder Foto Profil */}
                <div className="md:col-span-4 bg-slate-100/80 rounded-2xl h-64 flex items-center justify-center text-xs text-slate-500 font-semibold border border-slate-200">
                  Foto Profil
                </div>

                {/* Form Informasi Profil */}
                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="space-y-1">
                    <label className="text-slate-700">Nama Lengkap</label>
                    <input
                      type="text"
                      readOnly
                      value={profileData.fullName}
                      className="w-full bg-slate-100/90 text-slate-900 px-3.5 py-2.5 rounded-xl border-none focus:outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-slate-700">Gelar</label>
                    <input
                      type="text"
                      readOnly
                      value={profileData.title}
                      className="w-full bg-slate-100/90 text-slate-900 px-3.5 py-2.5 rounded-xl border-none focus:outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-6">
                    <label className="text-slate-700">NIP</label>
                    <input
                      type="text"
                      readOnly
                      value={profileData.nip}
                      className="w-full bg-slate-100/90 text-slate-900 px-3.5 py-2.5 rounded-xl border-none focus:outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700">Email Kampus</label>
                    <input
                      type="text"
                      readOnly
                      value={profileData.email}
                      className="w-full bg-slate-100/90 text-slate-900 px-3.5 py-2.5 rounded-xl border-none focus:outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700">No Handphone</label>
                    <input
                      type="text"
                      readOnly
                      value={profileData.phone}
                      className="w-full bg-slate-100/90 text-slate-900 px-3.5 py-2.5 rounded-xl border-none focus:outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700">Program Studi</label>
                    <input
                      type="text"
                      readOnly
                      value={profileData.department}
                      className="w-full bg-slate-100/90 text-slate-900 px-3.5 py-2.5 rounded-xl border-none focus:outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-slate-700">Jabatan</label>
                    <input
                      type="text"
                      readOnly
                      value={profileData.position}
                      className="w-full bg-slate-100/90 text-slate-900 px-3.5 py-2.5 rounded-xl border-none focus:outline-none font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

         {/* TAB 2: PREFERENSI AI */}
{activeTab === "preferensi-ai" && (
  <div className="bg-[#C2D9FF] p-6 rounded-2xl shadow-xs text-slate-900 space-y-6">
    <h3 className="text-sm font-bold text-slate-950">
      Konfigurasi Parameter Evaluator AI
    </h3>

    {/* Menggunakan gap-y-6 untuk memberi spasi lebih antar baris box */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 text-xs font-semibold">
      <div className="flex flex-col">
        <label className="text-slate-700 mb-2">Parameter Kehadiran Mahasiswa</label>
        <input
          type="text"
          value={aiSettings.attendanceThreshold}
          onChange={(e) =>
            setAiSettings({ ...aiSettings, attendanceThreshold: e.target.value })
          }
          className="w-full bg-slate-100/90 text-slate-900 px-4 py-3 rounded-xl border-none focus:outline-none font-medium"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-slate-700 mb-2">Parameter Nilai Untuk Ditandai</label>
        <input
          type="text"
          value={aiSettings.gradeThreshold}
          onChange={(e) =>
            setAiSettings({ ...aiSettings, gradeThreshold: e.target.value })
          }
          className="w-full bg-slate-100/90 text-slate-900 px-4 py-3 rounded-xl border-none focus:outline-none font-medium"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-slate-700 mb-2">Gaya Bahasa & Preview</label>
        <input
          type="text"
          value={aiSettings.languageStyle}
          onChange={(e) =>
            setAiSettings({ ...aiSettings, languageStyle: e.target.value })
          }
          className="w-full bg-slate-100/90 text-slate-900 px-4 py-3 rounded-xl border-none focus:outline-none font-medium"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-slate-700 mb-2">Preview Kalimat</label>
        <textarea
          rows={2}
          value={aiSettings.sentencePreview}
          onChange={(e) =>
            setAiSettings({ ...aiSettings, sentencePreview: e.target.value })
          }
          className="w-full bg-slate-100/90 text-slate-900 px-4 py-2.5 rounded-xl border-none focus:outline-none font-medium resize-none"
        />
      </div>
    </div>
  </div>
)}

          {/* TAB 3: KEAMANAN & NOTIFIKASI */}
          {activeTab === "keamanan" && (
            <div className="space-y-6">
              {/* Card Ubah Kata Sandi */}
              <div className="bg-[#C2D9FF] p-6 rounded-2xl shadow-xs text-slate-900 space-y-4">
                <h3 className="text-sm font-bold text-slate-950">Ubah Kata Sandi</h3>

                <div className="space-y-3 text-xs font-semibold max-w-xl">
                  <div className="space-y-1">
                    <label className="text-slate-700">Password Saat Ini</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={securitySettings.currentPassword}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full bg-slate-100/90 text-slate-900 px-3.5 py-2.5 rounded-xl border-none focus:outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700">Password Baru</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={securitySettings.newPassword}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full bg-slate-100/90 text-slate-900 px-3.5 py-2.5 rounded-xl border-none focus:outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700">Konfirmasi Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={securitySettings.confirmPassword}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full bg-slate-100/90 text-slate-900 px-3.5 py-2.5 rounded-xl border-none focus:outline-none font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Card Pengaturan Pemberitahuan */}
              <div className="bg-[#C2D9FF] p-6 rounded-2xl shadow-xs text-slate-900 space-y-4">
                <h3 className="text-sm font-bold text-slate-950">Pengaturan Pemberitahuan</h3>

                <div className="space-y-3 text-xs font-semibold">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.emailNotification}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          emailNotification: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded-sm text-blue-800 bg-slate-100 border-none focus:ring-0 cursor-pointer"
                    />
                    <span className="text-slate-800">Notifikasi Email</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.systemNotification}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          systemNotification: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded-sm text-blue-800 bg-slate-100 border-none focus:ring-0 cursor-pointer"
                    />
                    <span className="text-slate-800">Notifikasi Sistem</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}