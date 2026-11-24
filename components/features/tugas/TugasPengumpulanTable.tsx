"use client";

import React, { useState } from "react";
import { PengumpulanMahasiswa } from "@/types/tugas";
import { resolveFileUrl } from "@/lib/api";
import { Search } from "lucide-react";

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
    <div className="space-y-4">
      {/* 1. Bar Filter & Pencarian */}
      <div className="bg-[#CBE0FF] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        {/* Tab Pills: Semua, Belum Dinilai, Sudah Dinilai (tanpa count) */}
        <div className="flex items-center gap-2">
          {(["Semua", "Belum Dinilai", "Sudah Dinilai"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#1B365D] text-white shadow-xs"
                    : "text-slate-800 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Input Pencarian Putih Membulat */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama mahasiswa"
            className="bg-white rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none w-full sm:w-64 md:w-80 shadow-2xs"
          />
        </div>
      </div>

      {/* 2. Container Besar Tabel & Daftar Pengumpulan */}
      <div className="bg-[#CBE0FF] rounded-2xl p-4 shadow-sm space-y-3">
        {/* Header Bar Tabel Navy Gelap */}
        <div className="bg-[#1B365D] text-white rounded-xl px-6 py-3.5 text-xs font-bold grid grid-cols-12 items-center shadow-xs">
          <div className="col-span-3 leading-tight">
            <div>Nama Mahasiswa</div>
            <div className="text-[11px] text-slate-300 font-normal">NIM</div>
          </div>
          <div className="col-span-3">Waktu Pengumpulan</div>
          <div className="col-span-3">File / Link Tugas</div>
          <div className="col-span-2">Status & Nilai</div>
          <div className="col-span-1 text-right">Aksi</div>
        </div>

        {/* Daftar Baris Mahasiswa (Kartu Terpisah #E3EEFF) */}
        {filteredList.length === 0 ? (
          <div className="bg-[#E9F2FF] rounded-xl p-8 text-center text-slate-600 text-xs font-medium">
            Tidak ada mahasiswa yang sesuai dengan filter pencarian.
          </div>
        ) : (
          filteredList.map((item) => {
            const isGraded =
              item.statusPenilaian === "Sudah Dinilai" ||
              (item.nilai !== null && item.nilai !== undefined);
            const isTepatWaktu = item.statusWaktu === "Tepat Waktu";

            return (
              <div
                key={item.id}
                className="bg-[#E9F2FF] rounded-xl px-6 py-3.5 shadow-sm grid grid-cols-12 items-center hover:bg-blue-50/90 transition-colors"
              >
                {/* Kolom 1: Nama & NIM (Tanpa Avatar Lingkaran) */}
                <div className="col-span-3">
                  <p className="font-bold text-slate-900 text-sm leading-snug">
                    {item.namaMahasiswa}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {item.nim}
                  </p>
                </div>

                {/* Kolom 2: Tanggal & Jam di atas, teks Tepat waktu/Terlambat di bawah */}
                <div className="col-span-3">
                  <p className="text-xs font-semibold text-slate-800">
                    {item.waktuPengumpulan || "03 Okt 2026, 19:42"}
                  </p>
                  <p
                    className={`text-[11px] font-bold mt-0.5 ${
                      isTepatWaktu ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {isTepatWaktu ? "Tepat waktu" : "Terlambat"}
                  </p>
                </div>

                {/* Kolom 3: Badge Putih Membulat Bertumpuk Vertikal */}
                <div className="col-span-3 flex flex-col gap-1.5">
                  {/* Link Repository (jika ada) */}
                  {item.linkRepo && (
                    <a
                      href={
                        item.linkRepo.startsWith("http")
                          ? item.linkRepo
                          : `https://github.com/${item.linkRepo}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium w-fit hover:underline shadow-2xs"
                    >
                      <svg className="w-3.5 h-3.5 text-slate-900 fill-current shrink-0" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                      </svg>
                      <span className="truncate max-w-[150px]">
                        {item.linkRepo}
                      </span>
                    </a>
                  )}

                  {/* File Tugas dari Cloudinary / Backend (jika ada) */}
                  {resolveFileUrl(item.fileUrl) && (
                    <a
                      href={resolveFileUrl(item.fileUrl) || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#FFF0F0] border border-[#FFCDD2] text-[#D32F2F] rounded-lg px-2.5 py-1 text-xs font-medium w-fit hover:underline shadow-2xs"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-[#D32F2F] shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <path d="M10 12v6" />
                        <path d="M7 15h6" />
                      </svg>
                      <span className="truncate max-w-[150px]">
                        {item.fileName || "Lihat File Tugas"}
                      </span>
                    </a>
                  )}

                  {!item.linkRepo && !resolveFileUrl(item.fileUrl) && (
                    <span className="text-xs text-slate-400 italic">Tidak ada lampiran</span>
                  )}
                </div>

                {/* Kolom 4: Status & Nilai (Badge Belum Dinilai kuning atau Skor hijau) */}
                <div className="col-span-2">
                  {isGraded ? (
                    <span className="inline-block bg-[#C7F0C2] text-[#1E4620] text-xs font-bold px-3.5 py-1 rounded-md text-center shadow-2xs">
                      {item.nilai}/100
                    </span>
                  ) : (
                    <span className="inline-block bg-[#FEF7B9] text-[#7A6A00] text-xs font-bold px-3 py-1 rounded-md text-center shadow-2xs">
                      Belum Dinilai
                    </span>
                  )}
                </div>

                {/* Kolom 5: Aksi (Nilai navy atau Edit Nilai outline tanpa icon) */}
                <div className="col-span-1 text-right">
                  {isGraded ? (
                    <button
                      type="button"
                      onClick={() => onOpenNilaiModal(item)}
                      className="border border-[#93C5FD] bg-white text-[#1B365D] hover:bg-blue-50 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer"
                    >
                      Edit Nilai
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenNilaiModal(item)}
                      className="bg-[#1B365D] hover:bg-[#152a48] text-white text-xs font-bold px-4 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Nilai
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
