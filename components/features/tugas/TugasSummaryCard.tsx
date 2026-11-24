"use client";

import React from "react";
import { 
  BookOpen, 
  Calendar, 
  LayoutGrid,
} from "lucide-react";
import { DetailTugasInfo, RingkasanStatistik } from "@/types/tugas";

interface TugasSummaryCardProps {
  tugas: DetailTugasInfo;
  statistik: RingkasanStatistik;
}

export default function TugasSummaryCard({ tugas, statistik }: TugasSummaryCardProps) {
  let formattedDeadline = "";
  if (tugas.deadline) {
    const d = new Date(tugas.deadline);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      formattedDeadline = `${yyyy}-${mm}-${dd} (23:59 WIB)`;
    }
  }
  if (!formattedDeadline) {
    formattedDeadline = tugas.deadlineText || "Hari ini (23:59 WIB)";
  }

  const totalMahasiswa = statistik.totalMahasiswa ?? 0;
  const jumlahTerkumpul = statistik.jumlahTerkumpul ?? 0;
  const persentaseTerkumpul = totalMahasiswa > 0 
    ? Math.round((jumlahTerkumpul / totalMahasiswa) * 100) 
    : (statistik.persentaseTerkumpul ?? 0);
  const sudahDinilai = statistik.sudahDinilai ?? 0;
  const belumDinilai = statistik.belumDinilai ?? 0;

  return (
    <div className="bg-[#D1E3FD] dark:bg-[#162744] rounded-3xl p-6 md:p-7 shadow-xs space-y-4">
      {/* Top Badges */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold bg-white text-[#182B4E] shadow-2xs">
          <BookOpen className="w-3.5 h-3.5 fill-current" />
          <span>{tugas.mataKuliah || "Kecerdasan Buatan"}</span>
        </span>
        <span className="px-4 py-1 rounded-full text-xs font-bold bg-[#A7F3D0] text-[#065F46] shadow-2xs">
          Status: {tugas.status || "Berjalan"}
        </span>
      </div>

      {/* Main Title */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
        {tugas.judul || "Proyek Klasifikasi Data"}
      </h1>

      {/* Sub Metadata (Tenggat & Kelas) */}
      <div className="flex items-center gap-8 text-xs font-semibold text-slate-800 dark:text-slate-200">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-900 dark:text-slate-100" />
          <span>Tenggat: {formattedDeadline}</span>
        </div>
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-slate-900 dark:text-slate-100" />
          <span>Kelas: {tugas.kodeKelas || "VTI51366"}</span>
        </div>
      </div>

      {/* Inner White Box Card */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 md:p-6 shadow-sm space-y-4 mt-2">
        {/* Upper Total Info & Percentage Pill */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              TOTAL PENGUMPULAN
            </p>
            <div className="flex items-baseline gap-2.5 mt-0.5">
              <span className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white">
                {jumlahTerkumpul}/{totalMahasiswa}
              </span>
              <span className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-300">
                Mahasiswa sudah mengumpulkan
              </span>
            </div>
          </div>
          <div className="bg-[#EBF3FF] text-[#1D4ED8] dark:bg-blue-950/60 dark:text-blue-300 border border-[#BFDBFE] dark:border-blue-800 px-4 py-1.5 rounded-full text-xs font-bold shadow-2xs">
            {persentaseTerkumpul}% Terkumpul
          </div>
        </div>

        {/* Full-width Navy Progress Bar */}
        <div className="w-full bg-[#E2E8F0] dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-[#182B4E] dark:bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(5, persentaseTerkumpul))}%` }}
          />
        </div>

        {/* 2 Split Stat Cards */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          {/* Sudah Dinilai */}
          <div className="bg-[#C7F9CC] dark:bg-emerald-950/50 rounded-xl p-3 px-5 flex items-center justify-between text-[#14532D] dark:text-emerald-300">
            <span className="text-xs font-semibold">Sudah Dinilai:</span>
            <span className="text-base md:text-lg font-bold">{sudahDinilai}</span>
          </div>

          {/* Belum Dinilai */}
          <div className="bg-[#FEF9C3] dark:bg-amber-950/50 rounded-xl p-3 px-5 flex items-center justify-between text-[#713F12] dark:text-amber-300">
            <span className="text-xs font-semibold">Belum Dinilai:</span>
            <span className="text-base md:text-lg font-bold">{belumDinilai}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
