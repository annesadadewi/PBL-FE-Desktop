"use client";

import React, { useState } from "react";
import { 
  Search, 
  FileText,
  FileSpreadsheet,
  FileCode,
  Video,
  Music,
  Image as ImageIcon,
  Archive,
  ExternalLink,
} from "lucide-react";
import { PengumpulanMahasiswa } from "@/types/tugas";
import { resolveFileUrl } from "@/lib/api";
import { ModalPreviewDokumen } from "./ModalPreviewDokumen";

const GithubIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const FigmaIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 38 57" fill="none">
    <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
    <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
    <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
    <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
    <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
  </svg>
);

const DriveIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#FFC107" d="M12.01 1.99L4.99 14.16l3.51 6.07 7.02-12.17z"/>
    <path fill="#4CAF50" d="M8.5 20.23h14.04l-3.51-6.07H4.99z"/>
    <path fill="#2196F3" d="M22.54 14.16L15.52 1.99H8.5l7.02 12.17z"/>
  </svg>
);

function getLinkBadge(url: string) {
  const lower = url.toLowerCase();
  if (lower.includes("figma.com")) {
    return {
      label: "Figma File / Prototype",
      className: "border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300",
      icon: <FigmaIcon className="w-3.5 h-3.5 shrink-0" />,
    };
  }
  if (lower.includes("drive.google.com") || lower.includes("docs.google.com")) {
    return {
      label: "Google Drive",
      className: "border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
      icon: <DriveIcon className="w-3.5 h-3.5 shrink-0" />,
    };
  }
  if (lower.includes("github.com") || lower.includes("gitlab.com")) {
    let repoDisplay = url;
    try {
      const parts = url.replace(/^https?:\/\/(www\.)?(github|gitlab)\.com\//i, "").split("/");
      repoDisplay = `${parts[0] || "repo"}/${parts[1] || "project"}`;
      if (!repoDisplay.endsWith("/")) repoDisplay += "/";
    } catch (_) {}
    return {
      label: repoDisplay,
      className: "border-slate-800 dark:border-slate-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white",
      icon: <GithubIcon className="w-3.5 h-3.5 text-black dark:text-white shrink-0" />,
    };
  }
  let domain = "Tautan Eksternal";
  try {
    domain = new URL(url).hostname.replace(/^www\./, "");
  } catch (_) {}
  return {
    label: domain,
    className: "border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
    icon: <ExternalLink className="w-3.5 h-3.5 shrink-0" />,
  };
}

function getFileBadge(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (["xls", "xlsx", "csv"].includes(ext)) {
    return {
      className: "border-emerald-300 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
      icon: <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
    };
  }
  if (["doc", "docx", "txt", "rtf"].includes(ext)) {
    return {
      className: "border-blue-300 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
      icon: <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />,
    };
  }
  if (["ppt", "pptx"].includes(ext)) {
    return {
      className: "border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
      icon: <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
    };
  }
  if (["mp4", "mov", "mkv", "avi", "webm"].includes(ext)) {
    return {
      className: "border-purple-300 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300",
      icon: <Video className="w-3.5 h-3.5 text-purple-600 shrink-0" />,
    };
  }
  if (["mp3", "wav", "m4a", "aac", "ogg"].includes(ext)) {
    return {
      className: "border-indigo-300 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300",
      icon: <Music className="w-3.5 h-3.5 text-indigo-600 shrink-0" />,
    };
  }
  if (["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp"].includes(ext)) {
    return {
      className: "border-teal-300 dark:border-teal-900 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300",
      icon: <ImageIcon className="w-3.5 h-3.5 text-teal-600 shrink-0" />,
    };
  }
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
    return {
      className: "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
      icon: <Archive className="w-3.5 h-3.5 text-slate-600 shrink-0" />,
    };
  }
  if (["sql", "json", "py", "js", "ts", "html", "css"].includes(ext)) {
    return {
      className: "border-cyan-300 dark:border-cyan-900 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300",
      icon: <FileCode className="w-3.5 h-3.5 text-cyan-600 shrink-0" />,
    };
  }
  // Default PDF
  return {
    className: "border-rose-300 dark:border-rose-900 bg-[#FEE2E2] dark:bg-rose-950/40 text-rose-600 dark:text-rose-300",
    icon: <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />,
  };
}

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
  const [previewSubmission, setPreviewSubmission] = useState<PengumpulanMahasiswa | null>(null);

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
            const fileDownloadUrl = (sub.fileUrl
              ? resolveFileUrl(sub.fileUrl)
              : (sub.id ? resolveFileUrl(`/api/pengumpulan-tugas/${sub.id}/file`) : null)) || "#";
            
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
                    {/* Link Tugas Eksternal (Figma / Drive / GitHub / Web) */}
                    {sub.linkRepo ? (() => {
                      const badge = getLinkBadge(sub.linkRepo);
                      return (
                        <a
                          href={sub.linkRepo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`border rounded-lg px-2.5 py-1 inline-flex items-center gap-1.5 text-[11px] font-semibold transition-colors shadow-2xs ${badge.className}`}
                          title={sub.linkRepo}
                        >
                          {badge.icon}
                          <span className="truncate max-w-[130px]">{badge.label}</span>
                        </a>
                      );
                    })() : null}

                    {/* Berkas Dokumen / Media / Arsip */}
                    {sub.fileName ? (() => {
                      const badge = getFileBadge(sub.fileName);
                      return (
                        <button
                          type="button"
                          onClick={() => setPreviewSubmission(sub)}
                          className={`border rounded-lg px-2.5 py-1 inline-flex items-center gap-1.5 text-[11px] font-semibold transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${badge.className}`}
                          title={`Klik untuk pratinjau dokumen ${sub.fileName}`}
                        >
                          {badge.icon}
                          <span className="truncate max-w-[130px]">{fileDisplay}</span>
                        </button>
                      );
                    })() : null}

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

      {/* Modal Pratinjau Dokumen ala Google Classroom (Bebas IDM Hijack) */}
      <ModalPreviewDokumen
        isOpen={Boolean(previewSubmission)}
        submission={previewSubmission}
        onClose={() => setPreviewSubmission(null)}
        onOpenPenilaian={(sub) => {
          setPreviewSubmission(null);
          onOpenNilaiModal(sub);
        }}
      />
    </div>
  );
}
