"use client";

import React, { useState } from "react";
import { PengumpulanMahasiswa } from "@/types/tugas";
import { Search, FileText, ExternalLink, CheckCircle2, Clock, Edit3, Award } from "lucide-react";

interface TugasPengumpulanTableProps {
  daftarPengumpulan: PengumpulanMahasiswa[];
  onOpenNilaiModal: (item: PengumpulanMahasiswa) => void;
}

export default function TugasPengumpulanTable({
  daftarPengumpulan,
  onOpenNilaiModal,
}: TugasPengumpulanTableProps) {
  const [activeTab, setActiveTab] = useState<"Semua" | "Belum Dinilai" | "Sudah Dinilai">("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Tab & Search
  const filteredList = daftarPengumpulan.filter((item) => {
    // 1. Filter Tab
    if (activeTab === "Belum Dinilai" && item.statusPenilaian === "Sudah Dinilai") return false;
    if (activeTab === "Sudah Dinilai" && item.statusPenilaian !== "Sudah Dinilai") return false;

    // 2. Filter Search
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.namaMahasiswa.toLowerCase().includes(q) ||
      item.nim.toLowerCase().includes(q) ||
      (item.fileName && item.fileName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
      {/* 1. Baris Filter Tab & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tab Pill: Semua, Belum Dinilai, Sudah Dinilai */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
          {(["Semua", "Belum Dinilai", "Sudah Dinilai"] as const).map((tab) => {
            const count =
              tab === "Semua"
                ? daftarPengumpulan.length
                : tab === "Belum Dinilai"
                ? daftarPengumpulan.filter((d) => d.statusPenilaian !== "Sudah Dinilai").length
                : daftarPengumpulan.filter((d) => d.statusPenilaian === "Sudah Dinilai").length;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab
                    ? "bg-[#182B4E] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar: Cari nama mahasiswa atau NIM */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama mahasiswa atau NIM..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#182B4E] dark:focus:ring-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* 2. Tabel Pengumpulan */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4">Nama Mahasiswa & NIM</th>
              <th className="py-3.5 px-4">Waktu Pengumpulan</th>
              <th className="py-3.5 px-4">File / Link Tugas</th>
              <th className="py-3.5 px-4">Status & Nilai</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-500 dark:text-slate-400">
                  Tidak ada mahasiswa yang sesuai dengan filter pencarian.
                </td>
              </tr>
            ) : (
              filteredList.map((item) => {
                const isGraded =
                  item.statusPenilaian === "Sudah Dinilai" ||
                  (item.nilai !== null && item.nilai !== undefined);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Kolom 1: Nama & NIM */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#182B4E]/10 dark:bg-blue-900/30 text-[#182B4E] dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {item.namaMahasiswa.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-tight">
                            {item.namaMahasiswa}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            NIM: {item.nim}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Kolom 2: Waktu Pengumpulan */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            item.statusWaktu === "Tepat Waktu"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50"
                          }`}
                        >
                          {item.statusWaktu === "Tepat Waktu" ? (
                            <CheckCircle2 className="w-2.5 h-2.5" />
                          ) : (
                            <Clock className="w-2.5 h-2.5" />
                          )}
                          {item.statusWaktu}
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                          {item.waktuPengumpulan}
                        </p>
                      </div>
                    </td>

                    {/* Kolom 3: File / Link Tugas (badge GitHub & PDF) */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Badge PDF */}
                        <a
                          href={item.fileUrl || "#"}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => {
                            if (!item.fileUrl || item.fileUrl.startsWith("#")) {
                              e.preventDefault();
                              alert(`Membuka file: ${item.fileName || "Tugas.pdf"}`);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 text-[11px] font-semibold transition-colors cursor-pointer"
                          title="Lihat Berkas PDF"
                        >
                          <FileText className="w-3.5 h-3.5 text-rose-600" />
                          <span className="max-w-[120px] truncate">
                            {item.fileName || "Tugas.pdf"}
                          </span>
                        </a>

                        {/* Badge GitHub (jika ada) */}
                        {item.linkRepo && (
                          <a
                            href={item.linkRepo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
                            title="Buka Repository GitHub"
                          >
                            <svg className="w-3.5 h-3.5 fill-current text-slate-700 dark:text-slate-300" viewBox="0 0 24 24">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            <span>Repo</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Kolom 4: Status & Nilai */}
                    <td className="py-3.5 px-4">
                      {isGraded ? (
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs">
                            <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            {item.nilai} / 100
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-semibold text-[11px]">
                          <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          Belum Dinilai
                        </span>
                      )}
                    </td>

                    {/* Kolom 5: Aksi (Nilai / Edit Nilai) */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenNilaiModal(item)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                          isGraded
                            ? "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                            : "bg-[#182B4E] hover:bg-blue-900 text-white"
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isGraded ? "Edit Nilai" : "Nilai"}</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
