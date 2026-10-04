"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, CheckCircle2, ChevronDown, X } from "lucide-react";
import CustomSelect from "@/components/CustomSelect";

interface Student {
  id: string;
  name: string;
  nim: string;
  status: "Hadir" | "Izin" | "Sakit" | "Alpha";
  course: string;
  finalScore: number;
  gradeHistory: string;
  notes: string;
}

export default function KehadiranPage() {
  const { theme, setTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const pathname = usePathname();

  // Filter States
  const [selectedCourse, setSelectedCourse] = useState("Pemrograman Framework - Kelas A");
  const [selectedMeeting, setSelectedMeeting] = useState("Pertemuan 7");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Data Mahasiswa
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Anne Sada Dewi",
      nim: "20XX001",
      status: "Hadir",
      course: "Pemrograman Framework",
      finalScore: 87.5,
      gradeHistory: "Tugas 90 · Kuis 82 · UTS 85 · UAS 90",
      notes: "Menunjukkan konsistensi baik dalam diskusi",
    },
    {
      id: "2",
      name: "Sheren Annabelle",
      nim: "20XX002",
      status: "Hadir",
      course: "Pemrograman Framework",
      finalScore: 85.0,
      gradeHistory: "Tugas 88 · Kuis 80 · UTS 84 · UAS 88",
      notes: "Aktif dan tepat waktu mengumpulkan tugas",
    },
    {
      id: "3",
      name: "Kayla Indah Pasha",
      nim: "20XX003",
      status: "Hadir",
      course: "Pemrograman Framework",
      finalScore: 90.0,
      gradeHistory: "Tugas 92 · Kuis 88 · UTS 90 · UAS 90",
      notes: "Memiliki pemahaman konsep yang sangat mendalam",
    },
    {
      id: "4",
      name: "Aulia Sabillah",
      nim: "20XX004",
      status: "Hadir",
      course: "Pemrograman Framework",
      finalScore: 82.5,
      gradeHistory: "Tugas 85 · Kuis 78 · UTS 80 · UAS 87",
      notes: "Perlu ditingkatkan pada partisipasi praktikum",
    },
    {
      id: "5",
      name: "Silvi Caroline Zebua",
      nim: "20XX005",
      status: "Hadir",
      course: "Pemrograman Framework",
      finalScore: 88.0,
      gradeHistory: "Tugas 90 · Kuis 85 · UTS 86 · UAS 91",
      notes: "Sangat responsif saat tanya jawab di kelas",
    },
  ]);

  // Handler ubah status per mahasiswa
  const handleStatusChange = (
    id: string,
    newStatus: "Hadir" | "Izin" | "Sakit" | "Alpha"
  ) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  // Handler Tandai Semua Hadir
  const handleMarkAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: "Hadir" })));
  };

  // Filter pencarian
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nim.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Kalkulasi Ringkasan Status
  const countStatus = (statusType: "Hadir" | "Izin" | "Sakit" | "Alpha") => {
    return filteredStudents.filter((s) => s.status === statusType).length;
  };

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

        {/* PAGE CONTENT CONTAINER */}
        <div className="p-8 space-y-6 overflow-y-auto relative">
          
          {/* TITLE & HEADER BUTTONS */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
                Administrasi Pertemuan
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
                Kehadiran Mahasiswa
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Pilih kelas dan pertemuan, lalu pastikan status seluruh mahasiswa sebelum menyimpan
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-5 py-2.5 rounded-xl bg-[#294371] hover:bg-blue-900 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
              >
                Tandai Semua Hadir
              </button>
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl bg-[#294371] hover:bg-blue-900 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
              >
                Simpan Kehadiran
              </button>
            </div>
          </div>

          {/* FILTER CONTAINER (LIGHT BLUE CONTAINER) */}
          <div className="bg-[#CBE0FE] p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
            {/* Filter 1: Mata Kuliah */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Mata Kuliah
              </label>
<div className="relative">
  <CustomSelect
    options={[
      "Pemrograman Framework - Kelas A",
      "Mobile - Kelas D",
      "Kecerdasan Buatan - Kelas C",
      "Jaringan Komputer - Kelas G",
    ]}
    value={selectedCourse}
    onChange={(val) => setSelectedCourse(val)}
  />
</div>
            </div>

            {/* Filter 2: Pertemuan */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Pertemuan
              </label>
<div className="relative">
  <CustomSelect
    options={[
      "Pertemuan 7",
      "Pertemuan 6",
      "Pertemuan 5",
      "Pertemuan 4",
      "Pertemuan 3",
      "Pertemuan 2",
      "Pertemuan 1",
    ]}
    value={selectedMeeting}
    onChange={(val) => setSelectedMeeting(val)}
  />
</div>
            </div>

            {/* Filter 3: Cari Mahasiswa */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Cari Mahasiswa
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari Nama / NIM"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#294371] text-white placeholder-slate-400 text-xs font-medium py-2.5 px-4 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* STATS CARDS (HADIR, IZIN, SAKIT, ALPHA) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Hadir */}
            <div className="bg-[#D0F4DE] p-4 rounded-2xl shadow-sm">
              <div className="text-xs font-bold text-slate-800">Hadir</div>
              <div className="text-2xl font-extrabold text-black mt-3">
                {countStatus("Hadir")}
              </div>
            </div>

            {/* Izin */}
            <div className="bg-[#FEF9C3] p-4 rounded-2xl shadow-sm">
              <div className="text-xs font-bold text-slate-800">Izin</div>
              <div className="text-2xl font-extrabold text-black mt-3">
                {countStatus("Izin")}
              </div>
            </div>

            {/* Sakit */}
            <div className="bg-[#CFFAFE] p-4 rounded-2xl shadow-sm">
              <div className="text-xs font-bold text-slate-800">Sakit</div>
              <div className="text-2xl font-extrabold text-black mt-3">
                {countStatus("Sakit")}
              </div>
            </div>

            {/* Alpha */}
            <div className="bg-[#FEE2E2] p-4 rounded-2xl shadow-sm">
              <div className="text-xs font-bold text-slate-800">Alpha</div>
              <div className="text-2xl font-extrabold text-black mt-3">
                {countStatus("Alpha")}
              </div>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="bg-[#CBE0FE] rounded-2xl overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="bg-[#182B4E] text-white px-6 py-4 grid grid-cols-12 text-xs font-bold tracking-wider">
              <div className="col-span-4">Mahasiswa</div>
              <div className="col-span-3">NIM</div>
              <div className="col-span-3">Status Kehadiran</div>
              <div className="col-span-2 text-right pr-4">Lihat Detail</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-blue-200/60">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s) => (
                  <div
                    key={s.id}
                    className="px-6 py-3.5 grid grid-cols-12 items-center text-xs font-semibold text-slate-900"
                  >
                    <div className="col-span-4 font-bold">{s.name}</div>
                    <div className="col-span-3 text-slate-700">{s.nim}</div>
                    
                    {/* Select Status Dropdown */}
                    <div className="col-span-3">
                      <div className="relative inline-block w-28">
                        <select
                          value={s.status}
                          onChange={(e) =>
                            handleStatusChange(
                              s.id,
                              e.target.value as "Hadir" | "Izin" | "Sakit" | "Alpha"
                            )
                          }
                          className="w-full bg-white text-slate-900 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-300 shadow-sm appearance-none pr-7 focus:outline-none cursor-pointer"
                        >
                          <option value="Hadir">Hadir</option>
                          <option value="Izin">Izin</option>
                          <option value="Sakit">Sakit</option>
                          <option value="Alpha">Alpha</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2 top-2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Button Detail */}
                    <div className="col-span-2 text-right pr-2">
                      <button
                        type="button"
                        onClick={() => setSelectedStudent(s)}
                        className="text-blue-700 hover:text-blue-900 font-semibold hover:underline cursor-pointer"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-600">
                  Tidak ada data mahasiswa ditemukan.
                </div>
              )}
            </div>
          </div>

          {/* ---------------- MODAL DETAIL MAHASISWA ---------------- */}
          {selectedStudent && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-[#EBF3FE] text-slate-900 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative border border-blue-200">
                
                {/* Header Modal */}
                <div className="flex items-start justify-between pb-4 border-b border-blue-200">
                  <div>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Profil Mahasiswa
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                      Detail Mahasiswa
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="p-1.5 rounded-full hover:bg-blue-200/60 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content Modal */}
                <div className="mt-5 space-y-4">
                  {/* Name & NIM Card */}
                  <div className="bg-[#C1DAFE] p-4 rounded-2xl">
                    <h4 className="text-base font-bold text-slate-900">
                      {selectedStudent.name}
                    </h4>
                    <p className="text-xs text-slate-700 mt-0.5 font-medium">
                      {selectedStudent.nim} - {selectedStudent.course}
                    </p>
                  </div>

                  {/* Nilai Akhir & Kehadiran Card */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#C1DAFE] p-4 rounded-2xl">
                      <span className="text-xs font-semibold text-slate-700">
                        Nilai Akhir
                      </span>
                      <p className="text-xl font-bold text-slate-900 mt-1">
                        {selectedStudent.finalScore}
                      </p>
                    </div>
                    <div className="bg-[#C1DAFE] p-4 rounded-2xl">
                      <span className="text-xs font-semibold text-slate-700">
                        Kehadiran
                      </span>
                      <p className="text-xl font-bold text-slate-900 mt-1">
                        {selectedStudent.status}
                      </p>
                    </div>
                  </div>

                  {/* Riwayat Nilai */}
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-slate-900">
                      Riwayat Nilai
                    </h5>
                    <p className="text-xs text-slate-700 font-medium">
                      {selectedStudent.gradeHistory}
                    </p>
                  </div>

                  {/* Catatan & Rekomendasi */}
                  <div className="space-y-1 pt-1">
                    <h5 className="text-xs font-bold text-slate-900">
                      Catatan & Rekomendasi
                    </h5>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {selectedStudent.notes}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}