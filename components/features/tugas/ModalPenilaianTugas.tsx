"use client";

import React, { useState, useEffect } from "react";
import { PengumpulanMahasiswa, DetailTugasInfo } from "@/types/tugas";
import { X, FileText, ExternalLink, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ModalPenilaianTugasProps {
  isOpen: boolean;
  onClose: () => void;
  submission: PengumpulanMahasiswa | null;
  tugas: DetailTugasInfo;
  onSuccess: (updatedSub: PengumpulanMahasiswa) => void;
}

export default function ModalPenilaianTugas({
  isOpen,
  onClose,
  submission,
  tugas,
  onSuccess,
}: ModalPenilaianTugasProps) {
  const [skor, setSkor] = useState<string>("");
  const [catatan, setCatatan] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (submission) {
      setSkor(
        submission.nilai !== null && submission.nilai !== undefined
          ? String(submission.nilai)
          : ""
      );
      setCatatan(submission.catatan || "");
      setErrorMsg("");
    }
  }, [submission]);

  if (!isOpen || !submission) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const parsedScore = Number(skor);
    if (isNaN(parsedScore) || skor.trim() === "") {
      setErrorMsg("Mohon masukkan nilai berupa angka.");
      return;
    }
    if (parsedScore < 0 || parsedScore > 100) {
      setErrorMsg("Nilai harus berada dalam rentang 0 hingga 100.");
      return;
    }

    try {
      setLoading(true);
      // Panggil API PATCH /api/pengumpulan-tugas/:id/nilai
      const { pengumpulanService } = await import("@/services/pengumpulanService");
      await pengumpulanService.updateNilai(submission.id, parsedScore, catatan);

      // Callback success ke parent untuk langsung update UI tabel & statistik
      onSuccess({
        ...submission,
        nilai: parsedScore,
        statusPenilaian: "Sudah Dinilai",
        catatan,
      });

      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menyimpan nilai pengumpulan tugas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* 1. HEADER NAVY GELAP */}
        <div className="bg-[#182B4E] text-white p-5 flex items-start justify-between relative">
          <div>
            <p className="text-xs font-medium text-slate-300 uppercase tracking-wider">
              Pengumpulan Tugas Mahasiswa
            </p>
            <h3 className="text-lg font-bold text-white mt-1 pr-6 line-clamp-1">
              {tugas.judul}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. BODY KONTEN */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Kartu Info Mahasiswa */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {submission.namaMahasiswa}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                NIM: {submission.nim}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                  submission.statusWaktu === "Tepat Waktu"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                }`}
              >
                {submission.statusWaktu}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Dikumpulkan: {submission.waktuPengumpulan}
              </p>
            </div>
          </div>

          {/* Bagian Lampiran Tugas */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Lampiran Berkas Mahasiswa
            </label>

            {/* Kotak Merah Muda untuk File PDF */}
            <div className="bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {submission.fileName || "Dokumen_Tugas.pdf"}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Format Dokumen PDF
                  </p>
                </div>
              </div>

              <a
                href={submission.fileUrl || "#"}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  if (!submission.fileUrl || submission.fileUrl.startsWith("#")) {
                    e.preventDefault();
                    alert(`Membuka berkas: ${submission.fileName || "Dokumen_Tugas.pdf"}`);
                  }
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Lihat PDF</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Link Repository jika ada */}
            {submission.linkRepo && (
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <svg className="w-4 h-4 fill-current text-slate-700 dark:text-slate-300 shrink-0" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                    {submission.linkRepo}
                  </span>
                </div>
                <a
                  href={submission.linkRepo}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Buka Repo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Input Skor Penilaian (0 - 100) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Skor Penilaian (0 - 100) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={skor}
                onChange={(e) => setSkor(e.target.value)}
                placeholder="Contoh: 95"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#182B4E] dark:focus:ring-blue-500 transition-all placeholder:text-slate-400"
                autoFocus
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                / 100
              </span>
            </div>
          </div>

          {/* Catatan Dosen (Opsional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Catatan untuk Mahasiswa (Opsional)
            </label>
            <textarea
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Sangat baik, kode rapi dan implementasi sesuai instruksi."
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#182B4E] dark:focus:ring-blue-500 transition-all placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Pesan Error */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 3. TOMBOL SIMPAN NILAI DI KIRI BAWAH */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#182B4E] hover:bg-blue-900 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Simpan Nilai</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
