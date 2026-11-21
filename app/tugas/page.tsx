"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, CheckCircle2, X, Trash2, Loader2 } from "lucide-react";
import CustomSelect from "@/components/CustomSelect";
import { apiFetch } from "@/lib/api";

// Tipe Data Tugas
interface Task {
  id: number;
  subject: string;
  title: string;
  dueDate: string;
  submittedCount: number;
  totalStudents: number;
  status: "Belum Dinilai" | "Berjalan";
}

export default function TugasPage() {
  const { theme, setTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // State List Kelas dari Backend
  const [classList, setClassList] = useState<any[]>([]);
  
  // State Data Tugas
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua Status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State Loading & Submit
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State Modal
  const [newTitle, setNewTitle] = useState("");
  const [newClassId, setNewClassId] = useState<number>(1);
  const [newDueDate, setNewDueDate] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Fetch List Kelas dari Backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await apiFetch("/classes", { method: "GET" });
        const data = Array.isArray(res) ? res : res.data || [];
        setClassList(data);
        if (data.length > 0) {
          setNewClassId(data[0].id || 1);
        }
      } catch (err: any) {
        console.error("Gagal mengambil data kelas:", err);
      }
    };
    fetchClasses();
  }, []);

  // 2. Fetch Data Tugas dari Backend Express (READ)
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await apiFetch("/tugas", { method: "GET" });
      const data = Array.isArray(res) ? res : res.data || [];

      // Map data backend ke format UI Task
      const mappedTasks: Task[] = data.map((item: any) => ({
        id: item.id,
        subject: item.subject || item.nama_kelas || "Kecerdasan Buatan",
        title: item.title,
        dueDate: item.deadline,
        submittedCount: item.submitted_count || 0,
        totalStudents: item.total_students || 30,
        status: item.status || "Berjalan",
      }));

      // Jika database masih kosong, sediakan mock data awal agar layar tidak kosong
      if (mappedTasks.length === 0) {
        setTasks([
          { id: 1, subject: "Kecerdasan Buatan", title: "Proyek Klasifikasi Data", dueDate: "2026-10-08", submittedCount: 26, totalStudents: 32, status: "Belum Dinilai" },
          { id: 2, subject: "Pemrograman Framework", title: "Arsitektur MVC", dueDate: "2026-10-04", submittedCount: 25, totalStudents: 28, status: "Berjalan" },
          { id: 3, subject: "Mobile", title: "Integrasi REST API", dueDate: "2026-10-12", submittedCount: 18, totalStudents: 24, status: "Belum Dinilai" },
        ]);
      } else {
        setTasks(mappedTasks);
      }
    } catch (err: any) {
      console.error("Gagal mengambil data tugas:", err);
      setErrorMsg("Gagal memuat daftar tugas dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 3. Handle Tambah Tugas Baru (CREATE)
  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      setFormError("Judul tugas wajib diisi.");
      return;
    }
    if (trimmedTitle.length < 3) {
      setFormError("Judul tugas minimal 3 karakter.");
      return;
    }
    if (!newDueDate) {
      setFormError("Tenggat waktu tugas wajib dipilih.");
      return;
    }

    try {
      setSubmitting(true);
      await apiFetch("/tugas", {
        method: "POST",
        body: JSON.stringify({
          class_id: newClassId,
          title: trimmedTitle,
          description: newDescription || "Tugas reguler praktikum",
          deadline: newDueDate,
        }),
      });

      // Reset & Refresh Data
      setIsModalOpen(false);
      setNewTitle("");
      setNewDueDate("");
      setNewDescription("");
      setFormError("");
      fetchTasks();
    } catch (err: any) {
      setFormError(err.message || "Gagal membuat tugas baru");
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Handle Hapus Tugas (DELETE)
  const handleDeleteTask = async (id: number, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus tugas "${title}"?`)) return;

    try {
      await apiFetch(`/tugas/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus tugas");
    }
  };

  // Filter Tugas Berdasarkan Status
  const filteredTasks = tasks.filter((task) => {
    if (selectedStatus === "Semua Status") return true;
    return task.status === selectedStatus;
  });

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-black text-slate-900 dark:text-white overflow-hidden font-sans transition-colors duration-200">
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

      {/* AREA UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-black text-slate-900 dark:text-white transition-colors duration-200">
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

        {/* 3. KONTEN UTAMA TUGAS */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50 dark:bg-black">
          {/* Title Header & Tombol Tambah Tugas */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-normal text-slate-600 dark:text-slate-400">
                Pengelolaan Asesmen
              </p>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Tugas Mahasiswa
              </h1>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#2B4B7C] hover:bg-[#1e365a] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Tambah Tugas
            </button>
          </div>

          {/* Filter Dropdown Status */}
          <div className="w-44">
            <CustomSelect
              options={["Semua Status", "Belum Dinilai", "Berjalan"]}
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center gap-3 py-12 justify-center text-slate-500 dark:text-slate-400 text-sm font-medium">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memuat data tugas dari database...</span>
            </div>
          )}

          {/* Grid Card Tugas */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-[#C2D9FF] p-6 rounded-2xl flex flex-col justify-between h-48 text-slate-900 shadow-sm relative group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-700 font-medium">{task.subject}</p>
                      <button
                        onClick={() => handleDeleteTask(task.id, task.title)}
                        className="text-red-600 hover:text-red-800 p-1 transition-colors cursor-pointer"
                        title="Hapus Tugas"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="text-base font-bold text-slate-950 mt-1">
                      {task.title}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs text-slate-600 font-medium space-y-0.5">
                      <p>Tenggat: {task.dueDate}</p>
                      <p>
                        Sudah mengumpulkan: {task.submittedCount}/{task.totalStudents}
                      </p>
                    </div>

                    <div>
                      <span className="inline-block bg-white text-slate-800 text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs">
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 4. MODAL TAMBAH TUGAS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-[#E2EDFF] text-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4">
            {/* Tombol Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-[#C2D9FF] hover:bg-slate-300 rounded-lg text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title Modal */}
            <div>
              <p className="text-xs font-semibold text-slate-600">Asesmen Baru</p>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">Tambah Tugas</h2>
            </div>

            {formError && (
              <div className="p-2.5 bg-red-100 border border-red-300 text-red-700 text-xs font-semibold rounded-xl">
                {formError}
              </div>
            )}

            {/* Form Modal */}
            <form onSubmit={handleSaveTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Judul Tugas</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Masukkan judul tugas..."
                  className="w-full bg-[#BFDBFE] text-slate-900 placeholder-slate-500 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl focus:outline-none font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Kelas</label>
                <select
                  value={newClassId}
                  onChange={(e) => setNewClassId(Number(e.target.value))}
                  className="w-full bg-[#BFDBFE] text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl focus:outline-none font-medium cursor-pointer"
                >
                  {classList.length > 0 ? (
                    classList.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} {cls.classRoom ? `- ${cls.classRoom}` : ""}
                      </option>
                    ))
                  ) : (
                    <option value={1}>Pemrograman Framework - Kelas A</option>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Tenggat</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-[#BFDBFE] text-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl focus:outline-none font-medium cursor-pointer"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#2B4B7C] hover:bg-[#1e365a] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer mt-2 flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Simpan Tugas</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}