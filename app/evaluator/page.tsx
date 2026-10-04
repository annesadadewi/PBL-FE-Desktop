"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, CheckCircle2 } from "lucide-react";
import CustomSelect from "@/components/CustomSelect";

const classOptions = [
  "Kecerdasan Buatan - Kelas A",
  "Pemrograman Framework - Kelas A",
  "Mobile - Kelas D",
  "Kecerdasan Buatan - Kelas C",
  "Jaringan Komputer - Kelas G",
];

const studentOptions = [
  "Sheren Annabelle",
  "Aulia Sabillah",
  "Anne Sada Dewi",
  "Kayla Indah Pasha",
  "Silvi Caroline Zebua",
];

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

export default function EvaluatorPage() {
  const pathname = usePathname() || "/evaluator";
  const { theme, setTheme } = useTheme();

  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedClass, setSelectedClass] = useState(classOptions[0]);
  const [selectedStudent, setSelectedStudent] = useState(studentOptions[0]);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [notes, setNotes] = useState("");

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
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-black text-slate-900 dark:text-white transition-colors duration-200">
        {/* TOP HEADER BAR */}
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
        {/* KONTEN UTAMA EVALUATOR */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50 dark:bg-black">
          {/* Sub Header Title */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
              Dukungan Evaluasi Akademik
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              AI Student Evaluator
            </h1>
          </div>

          {/* Warning Banner */}
          <div className="bg-[#FFC107] text-slate-950 font-semibold rounded-xl p-3.5 text-xs sm:text-sm shadow-sm">
            Hasil AI adalah rekomendasi berbasis data placeholder dan bukan keputusan
            akademik final. Gunakan pertimbangan profesional dosen sebelum mengambil
            tindak lanjut.
          </div>

          {/* Filter Container */}
          <div className="bg-[#C2D9FF] p-5 rounded-2xl flex flex-col md:flex-row items-stretch md:items-end gap-4 shadow-sm text-slate-900">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Pilih Kelas
              </label>
<CustomSelect
  options={classOptions}
  value={selectedClass}
  onChange={(val) => {
    setSelectedClass(val);
    setIsAnalyzed(false);
  }}
/>
            </div>

            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Pilih Mahasiswa
              </label>
<CustomSelect
  options={studentOptions} // atau variabel array mahasiswa kamu
  value={selectedStudent}
  onChange={(val) => setSelectedStudent(val)}
/>
            </div>

            <button
              onClick={() => setIsAnalyzed(true)}
              className="bg-[#2B4B7C] hover:bg-[#1e365a] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              Analisis Mahasiswa
            </button>
          </div>

          {/* Grid Statistik + Insight + Catatan Dosen */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#C2D9FF] p-4 rounded-2xl flex flex-col justify-between h-24 text-slate-900">
                  <span className="text-xs font-bold text-slate-700">
                    Nilai Akhir
                  </span>
                  <span className="text-2xl font-extrabold">
                    {isAnalyzed ? "85.0" : "--"}
                  </span>
                </div>

                <div className="bg-[#C2D9FF] p-4 rounded-2xl flex flex-col justify-between h-24 text-slate-900">
                  <span className="text-xs font-bold text-slate-700">
                    Tren Kehadiran
                  </span>
                  <span className="text-2xl font-extrabold">
                    {isAnalyzed ? "92%" : "--"}
                  </span>
                </div>

                <div className="bg-[#C2D9FF] p-4 rounded-2xl flex flex-col justify-between h-24 text-slate-900">
                  <span className="text-xs font-bold text-slate-700">
                    Indikator Risiko
                  </span>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
                        isAnalyzed
                          ? "bg-[#8CE2B8] text-[#0A4B29]"
                          : "bg-white text-slate-900 shadow-sm"
                      }`}
                    >
                      {isAnalyzed ? "Rendah" : "Belum Dianalisis"}
                    </span>
                  </div>
                </div>
              </div>

              {/* INSIGHT Card */}
              <div className="bg-[#C2D9FF] p-6 rounded-2xl space-y-4 text-slate-900">
                <div>
                  <p className="text-[11px] font-extrabold text-slate-600 tracking-wider uppercase">
                    INSIGHT
                  </p>
                  <h2 className="text-xl font-bold mt-0.5">
                    Ringkasan Performa Akademik
                  </h2>
                  <p className="text-xs text-slate-700 mt-1">
                    {isAnalyzed
                      ? `Hasil analisis AI untuk ${selectedStudent} di kelas ${selectedClass}:`
                      : "Pilih mahasiswa lalu tekan Analisis Mahasiswa untuk melihat insight."}
                  </p>
                </div>

                {isAnalyzed && (
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    Mahasiswa menunjukkan performa konsisten pada tugas praktikum serta
                    memiliki tingkat pemahaman konsep dasar yang sangat baik.
                  </p>
                )}

                <div className="bg-[#8CE2B8] text-[#0A4B29] p-4 rounded-xl text-xs sm:text-sm font-medium space-y-1">
                  <div className="font-bold">Rekomendasi Tindak Lanjut</div>
                  <div>
                    {isAnalyzed
                      ? "Pertahankan tren positif dan berikan tantangan studi kasus tingkat lanjut."
                      : "Rekomendasi akan tampil setelah analisis."}
                  </div>
                </div>
              </div>
            </div>

            {/* Catatan Dosen */}
            <div className="bg-[#1B3152] text-white p-6 rounded-2xl flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold">Catatan Dosen</h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Simpan observasi dan tindak lanjut untuk ditinjau kembali.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">
                    Catatan Evaluasi
                  </label>
                  <textarea
                    rows={7}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tulis catatan tindak lanjut..."
                    className="w-full bg-[#8397B8] text-slate-950 placeholder-slate-600 text-xs sm:text-sm p-3.5 rounded-xl focus:outline-none resize-none font-medium"
                  />
                </div>
              </div>

              <button
                onClick={() => alert("Catatan berhasil disimpan!")}
                className="w-fit bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}