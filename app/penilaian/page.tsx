"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, CheckCircle2, ChevronDown, X, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Student {
  id: string;
  name: string;
  nim: string;
  tugas: number;
  kuis: number;
  uts: number;
  uas: number;
  kehadiran: string;
  catatan: string;
}

export default function PenilaianPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const pathname = usePathname();

  // Hydration Fix
  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {}
    }
  }, []);

  const [user, setUser] = useState<any>(null);

  // State List Kelas Backend
  const [classList, setClassList] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("Mobile - Kelas D");
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);

  // State Bobot (%)
  const [bobot, setBobot] = useState({
    tugas: 25,
    kuis: 15,
    uts: 25,
    uas: 35,
  });

  // State Data Mahasiswa & Status
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // State Modal Detail Mahasiswa
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // 1. Fetch List Kelas dari Backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await apiFetch("/classes", { method: "GET" });
        const data = Array.isArray(res) ? res : res.data || [];
        setClassList(data);
        if (data.length > 0) {
          const defaultName = data[0].name + (data[0].classRoom ? ` - ${data[0].classRoom}` : "");
          setSelectedClass(defaultName);
        }
      } catch (err: any) {
        console.error("Gagal mengambil data kelas:", err);
      }
    };
    fetchClasses();
  }, []);

  // 2. Fetch Data Penilaian dari Backend Express
  const fetchPenilaian = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await apiFetch("/penilaian", { method: "GET" });
      const data = Array.isArray(res) ? res : res.data || [];

      if (data.length > 0) {
        // Group data berdasarkan nama mahasiswa jika per tugas tersimpan terpisah
        const mappedStudents: Student[] = data.map((item: any, idx: number) => ({
          id: String(item.id || idx + 1),
          name: item.student_name || item.studentName || item.name || "Mahasiswa",
          nim: item.nim || `22010100${idx + 1}`,
          tugas: Number(item.tugas || item.score || 85),
          kuis: Number(item.kuis || 80),
          uts: Number(item.uts || 85),
          uas: Number(item.uas || 90),
          kehadiran: "Hadir",
          catatan: item.notes || "Hasil pengerjaan tugas konsisten dan rapi.",
        }));
        setStudents(mappedStudents);
      } else {
        // Data default awal dari database jika tabel masih kosong
        setStudents([
          { id: "1", name: "Anne Sada Dewi", nim: "220101001", tugas: 95, kuis: 95, uts: 95, uas: 95, kehadiran: "Hadir", catatan: "Menunjukkan konsistensi baik dalam diskusi" },
          { id: "2", name: "Sheren Annabelle", nim: "220101002", tugas: 92, kuis: 92, uts: 92, uas: 92, kehadiran: "Hadir", catatan: "Sangat aktif dan hasil pengerjaan sangat rapi" },
          { id: "3", name: "Kayla Indah Pasha", nim: "220101003", tugas: 75, kuis: 75, uts: 75, uas: 75, kehadiran: "Hadir", catatan: "Perlu ditingkatkan partisipasi dalam kelompok" },
          { id: "4", name: "Aulia Sabillah", nim: "220101004", tugas: 60, kuis: 60, uts: 60, uas: 60, kehadiran: "Hadir", catatan: "Sering terlambat mengumpulkan tugas tepat waktu" },
          { id: "5", name: "Silvi Caroline Zebua", nim: "220101005", tugas: 80, kuis: 80, uts: 80, uas: 80, kehadiran: "Hadir", catatan: "Pemahaman materi cukup baik, terus tingkatkan" },
        ]);
      }
    } catch (err: any) {
      console.error("Gagal mengambil data penilaian:", err);
      setErrorMsg("Gagal memuat data penilaian dari backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPenilaian();
  }, [selectedClass]);

  // Handler Perubahan Nilai Input Table (Batas Nilai 0 - 100)
  const handleScoreChange = (
    id: string,
    field: "tugas" | "kuis" | "uts" | "uas",
    value: number
  ) => {
    const clampedValue = Math.min(100, Math.max(0, isNaN(value) ? 0 : value));
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, [field]: clampedValue } : student
      )
    );
  };

  // Handler Perubahan Bobot Nilai (Total akumulasi maksimal 100%)
  const handleBobotChange = (
    field: "tugas" | "kuis" | "uts" | "uas",
    rawValue: number
  ) => {
    const val = Math.max(0, isNaN(rawValue) ? 0 : rawValue);
    const otherTotal = Object.entries(bobot)
      .filter(([key]) => key !== field)
      .reduce((sum, [, v]) => sum + (Number(v) || 0), 0);
    const maxAllowed = Math.max(0, 100 - otherTotal);
    const clamped = Math.min(val, maxAllowed);
    setBobot((prev) => ({
      ...prev,
      [field]: clamped,
    }));
  };

  // 3. Simpan Nilai ke Backend Database MySQL
  const handleSavePenilaian = async () => {
    try {
      setSaving(true);
      const activeCls = classList.find((c: any) =>
        (c.name + (c.classRoom ? ` - ${c.classRoom}` : "")) === selectedClass ||
        c.name === selectedClass
      );
      const targetClassId = activeCls?.id || (classList[0]?.id || "kelas-pfa");

      const savePromises = students.map((s) =>
        apiFetch("/penilaian", {
          method: "POST",
          body: JSON.stringify({
            class_id: targetClassId,
            student_name: s.name,
            task_name: "Penilaian Akhir",
            score: parseFloat(calculateFinalScore(s)),
          }),
        })
      );
      await Promise.all(savePromises);
      alert("Data penilaian mahasiswa berhasil disimpan ke database!");
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan data penilaian");
    } finally {
      setSaving(false);
    }
  };

  // Fungsi Hitung Nilai Akhir Berdasarkan Bobot
  const calculateFinalScore = (student: Student) => {
    const totalBobot = bobot.tugas + bobot.kuis + bobot.uts + bobot.uas || 100;
    const score =
      (student.tugas * bobot.tugas +
        student.kuis * bobot.kuis +
        student.uts * bobot.uts +
        student.uas * bobot.uas) /
      totalBobot;
    return score.toFixed(1);
  };

  const classOptions = classList.length > 0
    ? classList.map((c) => (c.name + (c.classRoom ? ` - ${c.classRoom}` : "")))
    : [
        "Pemrograman Framework - Kelas A",
        "Mobile - Kelas D",
        "Kecerdasan Buatan - Kelas C",
        "Jaringan Komputer - Kelas G",
      ];

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

        {/* CONTENT AREA */}
        <div className="p-8 space-y-6 overflow-y-auto">
          {/* JUDUL & DESKRIPSI & TOMBOL SIMPAN */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">
                Rekap Hasil Belajar
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-0.5 tracking-tight">
                Penilaian Mahasiswa
              </h2>
            </div>

            <button
              type="button"
              onClick={handleSavePenilaian}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#294371] dark:bg-[#253D68] hover:bg-[#152741] dark:hover:bg-[#1C2F52] text-white font-semibold text-xs shadow-sm transition-all cursor-pointer self-start md:self-auto flex items-center gap-2"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Simpan Nilai</span>
            </button>
          </div>

          {/* BOX FILTER KELAS & BOBOT PENILAIAN */}
          <div className="bg-[#CBE0FE] text-slate-900 p-5 rounded-2xl space-y-4 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              {/* Dropdown Filter Kelas */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Filter Kelas
                </label>
                <button
                  type="button"
                  onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                  className="w-full bg-[#294371] dark:bg-[#253D68] text-white text-xs font-medium px-4 py-2.5 rounded-xl flex items-center justify-between shadow-xs cursor-pointer"
                >
                  <span className="truncate">{selectedClass}</span>
                  <ChevronDown className="w-4 h-4 shrink-0 ml-1" />
                </button>

                {/* Dropdown Menu */}
                {isClassDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-[#EBF3FF] text-slate-900 rounded-xl shadow-xl border border-blue-200 py-1 z-30">
                    {classOptions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setSelectedClass(item);
                          setIsClassDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-blue-200/60 transition-colors cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Bobot Tugas */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Bobot Tugas (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={bobot.tugas}
                  onChange={(e) =>
                    handleBobotChange("tugas", Number(e.target.value))
                  }
                  className="w-full bg-[#294371] dark:bg-[#253D68] text-white text-xs font-medium px-4 py-2 rounded-xl focus:outline-none shadow-xs"
                />
              </div>

              {/* Input Bobot Kuis */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Bobot Kuis (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={bobot.kuis}
                  onChange={(e) =>
                    handleBobotChange("kuis", Number(e.target.value))
                  }
                  className="w-full bg-[#294371] dark:bg-[#253D68] text-white text-xs font-medium px-4 py-2 rounded-xl focus:outline-none shadow-xs"
                />
              </div>

              {/* Input Bobot UTS */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Bobot UTS (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={bobot.uts}
                  onChange={(e) =>
                    handleBobotChange("uts", Number(e.target.value))
                  }
                  className="w-full bg-[#294371] dark:bg-[#253D68] text-white text-xs font-medium px-4 py-2 rounded-xl focus:outline-none shadow-xs"
                />
              </div>

              {/* Input Bobot UAS */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Bobot UAS (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={bobot.uas}
                  onChange={(e) =>
                    handleBobotChange("uas", Number(e.target.value))
                  }
                  className="w-full bg-[#294371] dark:bg-[#253D68] text-white text-xs font-medium px-4 py-2 rounded-xl focus:outline-none shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Skenario Loading */}
          {loading && (
            <div className="flex items-center gap-3 py-12 justify-center text-slate-500 dark:text-slate-400 text-sm font-medium">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memuat data penilaian dari backend database...</span>
            </div>
          )}

          {/* TABEL PENILAIAN MAHASISWA */}
          {!loading && (
            <div className="bg-[#CBE0FE] text-slate-900 rounded-2xl overflow-hidden shadow-xs border border-blue-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  {/* Header Tabel Dark Blue */}
                  <thead>
                    <tr className="bg-[#182B4E] text-white text-xs font-semibold">
                      <th className="py-3.5 px-6">Mahasiswa</th>
                      <th className="py-3.5 px-4 text-center">Tugas</th>
                      <th className="py-3.5 px-4 text-center">Kuis</th>
                      <th className="py-3.5 px-4 text-center">UTS</th>
                      <th className="py-3.5 px-4 text-center">UAS</th>
                      <th className="py-3.5 px-4 text-center">Nilai Akhir</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-6 text-center">Detail</th>
                    </tr>
                  </thead>

                  {/* Body Tabel */}
                  <tbody className="divide-y divide-blue-200/80 text-xs font-medium text-slate-900">
                    {students.map((student) => {
                      const finalScore = parseFloat(calculateFinalScore(student));
                      const isTuntas = finalScore >= 70;

                      return (
                        <tr key={student.id} className="hover:bg-blue-200/40 transition-colors">
                          {/* Nama & NIM */}
                          <td className="py-3.5 px-6">
                            <div className="font-bold text-slate-900">
                              {student.name}
                            </div>
                            <div className="text-[11px] text-slate-600">
                              {student.nim}
                            </div>
                          </td>

                          {/* Input Nilai Tugas */}
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={student.tugas}
                              onChange={(e) =>
                                handleScoreChange(student.id, "tugas", Number(e.target.value))
                              }
                              className="w-14 bg-white text-slate-900 text-center py-1 rounded-md border border-slate-300 focus:outline-none text-xs font-semibold shadow-2xs"
                            />
                          </td>

                          {/* Input Nilai Kuis */}
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={student.kuis}
                              onChange={(e) =>
                                handleScoreChange(student.id, "kuis", Number(e.target.value))
                              }
                              className="w-14 bg-white text-slate-900 text-center py-1 rounded-md border border-slate-300 focus:outline-none text-xs font-semibold shadow-2xs"
                            />
                          </td>

                          {/* Input Nilai UTS */}
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={student.uts}
                              onChange={(e) =>
                                handleScoreChange(student.id, "uts", Number(e.target.value))
                              }
                              className="w-14 bg-white text-slate-900 text-center py-1 rounded-md border border-slate-300 focus:outline-none text-xs font-semibold shadow-2xs"
                            />
                          </td>

                          {/* Input Nilai UAS */}
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={student.uas}
                              onChange={(e) =>
                                handleScoreChange(student.id, "uas", Number(e.target.value))
                              }
                              className="w-14 bg-white text-slate-900 text-center py-1 rounded-md border border-slate-300 focus:outline-none text-xs font-semibold shadow-2xs"
                            />
                          </td>

                          {/* Nilai Akhir Hasil Kalkulasi */}
                          <td className="py-3.5 px-4 text-center font-bold text-slate-900 text-sm">
                            {finalScore.toFixed(1)}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                                isTuntas
                                  ? "bg-emerald-200 text-emerald-900"
                                  : "bg-amber-200 text-amber-900"
                              }`}
                            >
                              {isTuntas ? "Tuntas" : "Perlu Tindak Lanjut"}
                            </span>
                          </td>

                          {/* Link Lihat Detail */}
                          <td className="py-3.5 px-6 text-center">
                            <button
                              type="button"
                              onClick={() => setSelectedStudent(student)}
                              className="text-blue-700 font-bold hover:underline cursor-pointer"
                            >
                              Lihat Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ---------------- MODAL POP-UP DETAIL MAHASISWA ---------------- */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#EBF3FF] text-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative border border-blue-200">
            {/* Tombol Close */}
            <button
              type="button"
              onClick={() => setSelectedStudent(null)}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Sub-Header Modal */}
            <div>
              <p className="text-xs font-medium text-slate-600">
                Profil Mahasiswa
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Detail Mahasiswa
              </h3>
            </div>

            {/* Card Informasi Mahasiswa */}
            <div className="bg-[#CBE0FE] p-4 rounded-2xl shadow-xs">
              <div className="font-bold text-slate-900 text-base">
                {selectedStudent.name}
              </div>
              <div className="text-xs text-slate-700 font-medium mt-0.5">
                {selectedStudent.nim} • {selectedClass.split(" - ")[0]}
              </div>
            </div>

            {/* Grid Box Nilai Akhir & Kehadiran */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#CBE0FE] p-4 rounded-2xl shadow-xs">
                <p className="text-xs font-semibold text-slate-800">
                  Nilai Akhir
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {calculateFinalScore(selectedStudent)}
                </p>
              </div>

              <div className="bg-[#CBE0FE] p-4 rounded-2xl shadow-xs">
                <p className="text-xs font-semibold text-slate-800">
                  Kehadiran
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {selectedStudent.kehadiran}
                </p>
              </div>
            </div>

            {/* Riwayat Nilai */}
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">
                Riwayat Nilai
              </h4>
              <p className="text-xs text-slate-700 font-medium">
                Tugas {selectedStudent.tugas} · Kuis {selectedStudent.kuis} · UTS {selectedStudent.uts} · UAS {selectedStudent.uas}
              </p>
            </div>

            {/* Catatan & Rekomendasi */}
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">
                Catatan & Rekomendasi
              </h4>
              <p className="text-xs text-slate-700">
                {selectedStudent.catatan}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}