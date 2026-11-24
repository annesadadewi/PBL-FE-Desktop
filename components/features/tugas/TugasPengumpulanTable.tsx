"use client";

import React, { useState } from "react";
import { 
  Search, 
  FileText,
} from "lucide-react";
import { PengumpulanMahasiswa } from "@/types/tugas";
import { resolveFileUrl } from "@/lib/api";

const GithubIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface TugasPengumpulanTableProps {
  daftarPengumpulan: PengumpulanMahasiswa[];
  onOpenNilaiModal: (submission: PengumpulanMahasiswa) => void;
}

export default function TugasPengumpulanTable({
  daftarPengumpulan,
  onOpenNilaiModal,
}: TugasPengumpulanTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"Semua" | "Belum Dinilai" | "Sudah Dinilai">("Semua");

  const effectiveList = daftarPengumpulan;

  const filteredList = effectiveList.filter((sub) => {
    const isMatchSearch =
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.nim.toLowerCase().includes(searchQuery.toLowerCase());

    if (!isMatchSearch) return false;

    const isGraded = sub.statusPenilaian === "Sudah Dinilai" || (sub.nilai !== null && sub.nilai !== undefined);

    if (activeTab === "Belum Dinilai") {
      return !isGraded;
    }
    if (activeTab === "Sudah Dinilai") {
      return isGraded;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* 1. Bar Filter Tabs & Search (Sesuai Gambar) */}
      <div className="bg-[#CFE2FE] dark:bg-[#162744] rounded-2xl p-2 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab("Semua")}
            className={`px-7 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "Semua"
                ? "bg-[#24426B] text-white shadow-xs"
                : "text-slate-800 dark:text-slate-200 hover:text-black font-semibold"
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("Belum Dinilai")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "Belum Dinilai"
                ? "bg-[#24426B] text-white shadow-xs"
                : "text-slate-800 dark:text-slate-200 hover:text-black font-semibold"
            }`}
          >
            Belum Dinilai
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("Sudah Dinilai")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "Sudah Dinilai"
                ? "bg-[#24426B] text-white shadow-xs"
                : "text-slate-800 dark:text-slate-200 hover:text-black font-semibold"
            }`}
          >
            Sudah Dinilai
          </button>
        </div>

        {/* Input Search Mahasiswa */}
        <div className="relative w-full sm:w-64">
          <div className="bg-white dark:bg-[#111827] rounded-xl px-3.5 py-2 flex items-center gap-2 border border-slate-200/60 dark:border-slate-700 shadow-2xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Cari nama mahasiswa"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none bg-transparent font-medium"
            />
          </div>
        </div>
      </div>

      {/* 2. Banner Header Tabel Dark Navy */}
      <div className="bg-[#182B4E] text-white rounded-xl py-3 px-6 text-xs font-bold shadow-xs">
        <div className="grid grid-cols-12 items-center gap-2">
          <div className="col-span-3 text-left leading-tight">
            <span>Nama Mahasiswa</span>
            <span className="block text-[11px] font-normal text-slate-300">NIM</span>
          </div>
          <div className="col-span-3 text-left">Waktu Pengumpulan</div>
          <div className="col-span-3 text-left">File / Link Tugas</div>
          <div className="col-span-2 text-center">Status & Nilai</div>
          <div className="col-span-1 text-center">Aksi</div>
        </div>
      </div>

      {/* 3. Baris Mahasiswa (Masing-masing Card Terpisah Putih Berbayang) */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-10 text-center text-slate-400 text-xs font-medium border border-slate-100 dark:border-slate-800 shadow-xs">
            Tidak ada mahasiswa yang ditemukan untuk filter "{activeTab}".
          </div>
        ) : (
          filteredList.map((sub) => {
            const isGraded = sub.statusPenilaian === "Sudah Dinilai" || (sub.nilai !== null && sub.nilai !== undefined);
            const fileDownloadUrl = (sub.fileUrl ? resolveFileUrl(sub.fileUrl) : null) || "#";
            
            // Format repo display name seperti 'annesada/klasifikasi/'
            let repoDisplay = sub.linkRepo || "";
            if (repoDisplay) {
              try {
                const parts = repoDisplay.replace(/^https?:\/\/(www\.)?github\.com\//i, "").split("/");
                repoDisplay = `${parts[0] || "user"}/${parts[1] || "repo"}`;
                if (!repoDisplay.endsWith("/")) repoDisplay += "/";
              } catch (_) {}
            }

            // Format nama file seperti 'Laporan_Proyek_Klas'
            const fileDisplay = (sub.fileName || "Laporan_Proyek_Klas").replace(/\.[^/.]+$/, "");

            return (
              <div
                key={sub.id}
                className="bg-white dark:bg-[#111827] rounded-2xl p-4 px-6 shadow-xs border border-slate-100 dark:border-slate-800/80 hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-12 items-center gap-2">
                  {/* Kolom 1: Nama & NIM */}
                  <div className="col-span-3">
                    <p className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight">
                      {sub.studentName}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      {sub.nim}
                    </p>
                  </div>

                  {/* Kolom 2: Waktu Pengumpulan */}
                  <div className="col-span-3 space-y-0.5">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {sub.waktuPengumpulan}
                    </p>
                    <p className="text-xs font-bold text-[#10B981] dark:text-emerald-400">
                      {sub.statusWaktu === "Terlambat" ? "Terlambat" : "Tepat waktu"}
                    </p>
                  </div>

                  {/* Kolom 3: File / Link Tugas (Stacked Pills) */}
                  <div className="col-span-3 flex flex-col gap-1.5 items-start">
                    {/* Link GitHub Repo */}
                    {sub.linkRepo ? (
                      <a
                        href={sub.linkRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-slate-800 dark:border-slate-400 bg-white dark:bg-slate-900 rounded-lg px-2.5 py-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
                        title={sub.linkRepo}
                      >
                        <GithubIcon className="w-3.5 h-3.5 text-black dark:text-white shrink-0" />
                        <span className="truncate max-w-[130px]">{repoDisplay}</span>
                      </a>
                    ) : null}

                    {/* Berkas PDF */}
                    {sub.fileName ? (
                      <a
                        href={fileDownloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-rose-300 dark:border-rose-900 bg-[#FEE2E2] dark:bg-rose-950/40 rounded-lg px-2.5 py-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 dark:text-rose-300 hover:bg-rose-200/70 transition-colors shadow-2xs"
                        title={sub.fileName || undefined}
                      >
                        <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate max-w-[130px]">{fileDisplay}</span>
                      </a>
                    ) : null}

                    {!sub.linkRepo && !sub.fileName && (
                      <span className="text-xs text-slate-400 font-medium italic">
                        Tidak ada lampiran
                      </span>
                    )}
                  </div>

                  {/* Kolom 4: Status & Nilai */}
                  <div className="col-span-2 text-center">
                    {isGraded ? (
                      <span className="bg-[#C7F9CC] text-[#15803D] dark:bg-emerald-950/70 dark:text-emerald-300 border border-[#86EFAC] dark:border-emerald-800 rounded-full px-5 py-1 text-xs font-bold inline-block shadow-2xs">
                        {sub.nilai}/100
                      </span>
                    ) : (
                      <span className="text-[#EAB308] font-bold text-xs inline-block">
                        Belum Dinilai
                      </span>
                    )}
                  </div>

                  {/* Kolom 5: Tombol Aksi */}
                  <div className="col-span-1 text-center">
                    {isGraded ? (
                      <button
                        type="button"
                        onClick={() => onOpenNilaiModal(sub)}
                        className="bg-[#EBF3FF] text-[#1D4ED8] dark:bg-blue-950/60 dark:text-blue-300 border border-[#93C5FD] dark:border-blue-800 rounded-xl px-4 py-1.5 text-xs font-bold hover:bg-blue-100 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
                      >
                        Edit Nilai
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenNilaiModal(sub)}
                        className="bg-[#182B4E] hover:bg-[#12203b] text-white rounded-xl px-5 py-1.5 text-xs font-bold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Nilai
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
