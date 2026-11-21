"use client";

import React from "react";
import { DetailTugasInfo, RingkasanStatistik } from "@/types/tugas";
import { Calendar, CheckCircle2, Clock, Users, BookOpen } from "lucide-react";

interface TugasSummaryCardProps {
  tugas: DetailTugasInfo;
  statistik: RingkasanStatistik;
}

export default function TugasSummaryCard({ tugas, statistik }: TugasSummaryCardProps) {
  const persentase = statistik.totalMahasiswa > 0
    ? Math.min(100, Math.round((statistik.jumlahTerkumpul / statistik.totalMahasiswa) * 100))
    : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Baris Atas: Badge & Judul Tugas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-[#182B4E] dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
              <BookOpen className="w-3.5 h-3.5" />
              {tugas.mataKuliah || "Mata Kuliah"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {tugas.status || "Berjalan"}
            </span>
            {tugas.kodeKelas && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Kode: {tugas.kodeKelas}
              </span>
            )}
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {tugas.judul}
          </h2>

          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Tenggat Waktu: {tugas.deadlineText || "Hari ini, 23.59"}</span>
          </div>
        </div>

        {/* 2 Kartu Status (Sudah Dinilai hijau & Belum Dinilai kuning) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Kartu Hijau: Sudah Dinilai */}
          <div className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 min-w-[140px]">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                Sudah Dinilai
              </p>
              <p className="text-xl font-bold text-emerald-900 dark:text-emerald-200 leading-tight">
                {statistik.sudahDinilai}
              </p>
            </div>
          </div>

          {/* Kartu Kuning: Belum Dinilai */}
          <div className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 min-w-[140px]">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                Belum Dinilai
              </p>
              <p className="text-xl font-bold text-amber-900 dark:text-amber-200 leading-tight">
                {statistik.belumDinilai}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Baris Bawah: Progress Bar TOTAL PENGUMPULAN */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Total Pengumpulan Mahasiswa
          </span>
          <span className="text-slate-900 dark:text-white">
            {persentase}% ({statistik.jumlahTerkumpul} dari {statistik.totalMahasiswa} Mahasiswa)
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#182B4E] dark:bg-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${persentase}%` }}
          />
        </div>
      </div>
    </div>
  );
}
