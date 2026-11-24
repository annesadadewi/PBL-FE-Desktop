"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, CheckCircle2, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { pengumpulanService } from "@/services/pengumpulanService";
import {
  DetailTugasInfo,
  RingkasanStatistik,
  PengumpulanMahasiswa,
} from "@/types/tugas";
import TugasSummaryCard from "@/components/features/tugas/TugasSummaryCard";
import TugasPengumpulanTable from "@/components/features/tugas/TugasPengumpulanTable";
import ModalPenilaianTugas from "@/components/features/tugas/ModalPenilaianTugas";
import FormPengumpulanTugas from "@/components/features/tugas/FormPengumpulanTugas";

export default function DetailPengumpulanTugasPage() {
  const params = useParams();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // ID Tugas dari URL
  const taskId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  // State Profil Pengguna dari LocalStorage
  const [user, setUser] = useState<any>(null);

  // State Data Halaman
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [tugas, setTugas] = useState<DetailTugasInfo | null>(null);
  const [statistik, setStatistik] = useState<RingkasanStatistik>({
    totalMahasiswa: 0,
    jumlahTerkumpul: 0,
    persentaseTerkumpul: 0,
    sudahDinilai: 0,
    belumDinilai: 0,
  });
  const [daftarPengumpulan, setDaftarPengumpulan] = useState<PengumpulanMahasiswa[]>([]);

  // State Modal Penilaian
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSubmission, setSelectedSubmission] = useState<PengumpulanMahasiswa | null>(null);

  // Ambil data profil pengguna yang login
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {}
    }
  }, []);

  // Fetch Data Pengumpulan & Detail Tugas Langsung dari Database Backend
  const loadPengumpulanData = async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      setErrorMsg("");

      const res = await pengumpulanService.getPengumpulanByTugasId(taskId);
      if (res) {
        if (res.tugas) {
          setTugas(res.tugas);
        }
        if (res.statistik) {
          setStatistik(res.statistik);
        }
        if (Array.isArray(res.daftarPengumpulan)) {
          setDaftarPengumpulan(res.daftarPengumpulan);
        }
      }
    } catch (err: any) {
      console.warn("Gagal memuat detail pengumpulan tugas dari database:", err);
      // Fallback data default agar tampilan tetap konsisten jika backend sedang offline
      setTugas({
        id: taskId,
        judul: "Proyek Klasifikasi Data",
        mataKuliah: "Kecerdasan Buatan",
        kodeKelas: "VTI51366",
        status: "Berjalan",
        deadlineText: "2026-10-08 (23:59 WIB)",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPengumpulanData();
  }, [taskId]);

  // Handler Buka Modal Penilaian
  const handleOpenNilaiModal = (submission: PengumpulanMahasiswa) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  // Handler Saat Nilai Berhasil Disimpan dari Modal (Sinkron ke Database & State)
  const handleSuccessNilai = (updatedItem: PengumpulanMahasiswa) => {
    setDaftarPengumpulan((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === updatedItem.id);
      const nextList =
        existingIndex >= 0
          ? prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
          : [updatedItem, ...prev];

      // Perbarui statistik secara dinamis berdasarkan data terbaru
      const sudah = nextList.filter(
        (s) => s.statusPenilaian === "Sudah Dinilai" || (s.nilai !== null && s.nilai !== undefined)
      ).length;

      setStatistik((statPrev) => ({
        ...statPrev,
        sudahDinilai: sudah,
        belumDinilai: Math.max(0, statPrev.jumlahTerkumpul - sudah),
      }));

      return nextList;
    });

    // Re-fetch dari database di background agar data selalu sinkron dengan server
    try {
      loadPengumpulanData();
    } catch (_) {}
  };

  const currentTugasInfo: DetailTugasInfo = tugas || {
    id: taskId || "task",
    judul: "Memuat Tugas...",
    mataKuliah: "Mata Kuliah",
    kodeKelas: "-",
    status: "Berjalan",
    deadlineText: "-",
  };

  return (
    <div className="min-h-screen bg-[#F0F4FC] dark:bg-black text-slate-900 dark:text-white flex flex-col md:flex-row font-sans transition-colors duration-200">
      {/* ---------------- SIDEBAR LEFT (Sticky & Konsisten dengan Halaman Lain) ---------------- */}
      <aside className="w-full md:w-64 bg-[#182B4E] text-white flex flex-col justify-between shrink-0 md:h-screen md:sticky md:top-0 md:overflow-y-auto relative z-30">
        <div>
          {/* Logo Brand EduInsight */}
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
              className="flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer text-slate-200 hover:bg-blue-900/50 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/kelas-saya"
              className="flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer text-slate-200 hover:bg-blue-900/50 hover:text-white"
            >
              Kelas Saya
            </Link>
            <Link
              href="/kehadiran"
              className="flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer text-slate-200 hover:bg-blue-900/50 hover:text-white"
            >
              Kehadiran
            </Link>
            <Link
              href="/penilaian"
              className="flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer text-slate-200 hover:bg-blue-900/50 hover:text-white"
            >
              Penilaian
            </Link>
            <Link
              href="/evaluator"
              className="flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer text-slate-200 hover:bg-blue-900/50 hover:text-white"
            >
              AI Student Evaluator
            </Link>
            <Link
              href="/tugas"
              className="flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer bg-[#3B6DB3] text-white font-semibold shadow-sm"
            >
              Tugas
            </Link>
            <Link
              href="/kalender"
              className="flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer text-slate-200 hover:bg-blue-900/50 hover:text-white"
            >
              Kalender Akademik
            </Link>
            <Link
              href="/pengaturan"
              className="flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer text-slate-200 hover:bg-blue-900/50 hover:text-white"
            >
              Pengaturan
            </Link>
          </nav>
        </div>

        {/* Footer Sidebar Theme Switcher */}
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

      {/* ---------------- AREA UTAMA ---------------- */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F0F4FC] dark:bg-black text-slate-900 dark:text-white transition-colors duration-200">
        {/* TOP HEADER BAR DENGAN TOMBOL BACK */}
        <header className="h-20 bg-white dark:bg-black border-b border-slate-200/80 dark:border-slate-800 px-6 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Tombol Back untuk kembali ke halaman daftar fitur tugas */}
            <Link
              href="/tugas"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold text-[#182B4E] dark:text-blue-300 border border-slate-200/80 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
              title="Kembali ke Daftar Tugas"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Link>

            <h1 className="text-lg md:text-2xl font-bold text-black dark:text-white tracking-tight">
              Semester Ganjil 2026/2027
            </h1>
          </div>

          {/* Profil Pengguna */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-bold text-black dark:text-white leading-tight">
                {user?.name || user?.nama || "Mister Potato"}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {user?.fakultas || "Fakultas Vokasi"}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#182B4E] text-white flex items-center justify-center font-bold text-base shadow-sm">
              {(user?.name || user?.nama || "M").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* KONTEN DETAIL PENGUMPULAN TUGAS */}
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Error Banner jika ada */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Kartu Ringkasan Tugas Sesuai Mockup */}
          <TugasSummaryCard 
            tugas={currentTugasInfo} 
            statistik={statistik} 
          />

          {/* 2. Form Pengumpulan (Mahasiswa) atau Tabel Pengumpulan (Dosen) */}
          {user?.role?.toLowerCase() === "mahasiswa" ? (
            <FormPengumpulanTugas
              taskId={taskId}
              onSubmitted={loadPengumpulanData}
            />
          ) : (
            <TugasPengumpulanTable
              daftarPengumpulan={daftarPengumpulan}
              onOpenNilaiModal={handleOpenNilaiModal}
            />
          )}
        </main>
      </div>

      {/* 3. Modal Penilaian Tugas Sesuai Mockup */}
      <ModalPenilaianTugas
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submission={selectedSubmission}
        tugas={currentTugasInfo}
        onSuccess={handleSuccessNilai}
      />
    </div>
  );
}
