"use client";

import React, { useState, useEffect } from "react";
import { PengumpulanMahasiswa, DetailTugasInfo } from "@/types/tugas";
import { X, Loader2 } from "lucide-react";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (submission) {
      setSkor(
        submission.nilai !== null && submission.nilai !== undefined
          ? String(submission.nilai)
          : ""
      );
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
      const { pengumpulanService } = await import("@/services/pengumpulanService");
      await pengumpulanService.updateNilai(submission.id, parsedScore);

      onSuccess({
        ...submission,
        nilai: parsedScore,
        statusPenilaian: "Sudah Dinilai",
      });

      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menyimpan nilai pengumpulan tugas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* 1. HEADER MODAL NAVY GELAP (#1B365D) */}
        <div className="bg-[#1B365D] text-white p-5 flex items-start justify-between relative rounded-t-2xl">
          <div>
            <p className="text-xs text-slate-300 font-medium">
              Pengumpulan Tugas Mahasiswa
            </p>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1 pr-6 line-clamp-1">
              {tugas.judul || "Proyek Klasifikasi Data"}
            </h3>
          </div>

          {/* Tombol Tutup Kotak Putih / Biru Muda X di Kanan Atas */}
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 bg-[#CBE0FF] hover:bg-white text-slate-900 rounded-lg flex items-center justify-center font-bold text-xs transition-colors cursor-pointer shrink-0"
            title="Tutup Modal"
          >
            <X className="w-4 h-4 text-slate-800" />
          </button>
        </div>

        {/* 2. BODY MODAL BIRU SANGAT MUDA (#EBF3FF) */}
        <form onSubmit={handleSubmit} className="bg-[#EBF3FF] p-5 space-y-4 rounded-b-2xl">
          {errorMsg && (
            <div className="p-2.5 bg-red-100 border border-red-300 text-red-700 text-xs font-semibold rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Kartu Biru Muda Info Mahasiswa */}
          <div className="bg-[#CBE0FF] rounded-xl p-3.5 space-y-0.5">
            <h4 className="text-sm font-bold text-slate-900">
              {submission.namaMahasiswa}
            </h4>
            <p className="text-xs text-slate-700 font-medium">
              {submission.nim} . Dikumpulkan: {submission.waktuPengumpulan || "05 Okt 2026, 19:15"}
            </p>
          </div>

          {/* Bagian Lampiran Tugas */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Lampiran Tugas
            </label>

            {/* Kotak Merah Muda untuk File PDF */}
            <div className="bg-[#FFE5E5] border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <svg
                  className="w-4 h-4 text-red-600 shrink-0"
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
                <span className="text-red-700 font-medium truncate">
                  {submission.fileName || "Laporan_Proyek_Klasifikasi Data"}
                </span>
              </div>

              <a
                href={submission.fileUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 font-bold hover:underline shrink-0 cursor-pointer"
              >
                Lihat PDF
              </a>
            </div>
          </div>

          {/* Input Skor Penilaian (0-100) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Skor Penilaian (0-100)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={skor}
              onChange={(e) => setSkor(e.target.value)}
              placeholder="contoh: 95"
              className="w-full bg-[#CBE0FF] text-slate-900 placeholder-slate-500 text-xs sm:text-sm px-4 py-2.5 rounded-xl focus:outline-none font-medium"
              required
            />
          </div>

          {/* Tombol Simpan Nilai Biru Navy di Kiri Bawah */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1B365D] hover:bg-[#152a48] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Simpan Nilai</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
