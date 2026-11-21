"use client";

import React from "react";
import { DetailTugasInfo, RingkasanStatistik } from "@/types/tugas";
import { BookOpen, Calendar, LayoutGrid } from "lucide-react";

interface TugasSummaryCardProps {
  tugas: DetailTugasInfo;
  statistik: RingkasanStatistik;
}

export default function TugasSummaryCard({ tugas, statistik }: TugasSummaryCardProps) {
  const total = statistik.totalMahasiswa || 32;
  const terkumpul = statistik.jumlahTerkumpul;
  const persentase = total > 0 ? Math.min(100, Math.round((terkumpul / total) * 100)) : 90;

  return (
    <div className="bg-[#CBE0FF] rounded-2xl p-6 shadow-sm space-y-4">
      {/* 1. Baris Paling Atas: Badge Matkul & Status Berjalan */}
      <div className="flex items-center gap-3">
        {/* Badge Putih Nama Mata Kuliah */}
        <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#1B365D] shadow-2xs">
          <BookOpen className="w-3.5 h-3.5 text-[#1B365D]" />
          <span>{tugas.mataKuliah || "Kecerdasan Buatan"}</span>
        </div>

        {/* Badge Hijau Muda Status: Berjalan */}
        <div className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#B7F4B0] text-[#1E4620] shadow-2xs">
          Status: {tugas.status || "Berjalan"}
        </div>
      </div>

      {/* 2. Judul Tugas */}
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
        {tugas.judul || "Proyek Klasifikasi Data"}
      </h2>

      {/* 3. Baris Tenggat & Kelas Sejajar */}
      <div className="flex items-center gap-6 text-xs text-slate-800 font-medium">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-700" />
          <span>Tenggat: {tugas.deadlineText || "2026-10-08 (23:59 WIB)"}</span>
        </div>
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-slate-700" />
          <span>Kelas: {tugas.kodeKelas || "VTI51366"}</span>
        </div>
      </div>

      {/* 4. Kotak Putih Progres Pengumpulan */}
      <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
        {/* Header Kotak Putih: TOTAL PENGUMPULAN & Badge Outline Persentase */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 tracking-wider">
            TOTAL PENGUMPULAN
          </span>
          <span className="border border-blue-500 text-blue-700 text-xs font-bold px-3 py-1 rounded-lg">
            {persentase}% Terkumpul
          </span>
        </div>

        {/* Angka Besar Tebal & Teks Pengumpulan */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {terkumpul}/{total}
          </span>
          <span className="text-xs text-slate-700 font-semibold">
            Mahasiswa sudah mengumpulkan
          </span>
        </div>

        {/* Progress Bar Biru Navy */}
        <div className="w-full bg-[#DDE6F0] h-3.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1B365D] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${persentase}%` }}
          />
        </div>

        {/* Grid 2 Kolom: Sudah Dinilai & Belum Dinilai */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          {/* Kotak Hijau Pastel: Sudah Dinilai */}
          <div className="bg-[#C7F0C2] rounded-xl px-4 py-3 flex items-center justify-between text-slate-900 font-bold text-xs sm:text-sm">
            <span>Sudah Dinilai:</span>
            <span className="text-base">{statistik.sudahDinilai}</span>
          </div>

          {/* Kotak Kuning Pastel: Belum Dinilai */}
          <div className="bg-[#FEF7B9] rounded-xl px-4 py-3 flex items-center justify-between text-slate-900 font-bold text-xs sm:text-sm">
            <span>Belum Dinilai:</span>
            <span className="text-base">{statistik.belumDinilai}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
