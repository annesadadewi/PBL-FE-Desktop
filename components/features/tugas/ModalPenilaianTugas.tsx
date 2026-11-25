"use client";

import React, { useState, useEffect } from "react";
import { X, FileText, Loader2, AlertCircle } from "lucide-react";
import { PengumpulanMahasiswa, DetailTugasInfo } from "@/types/tugas";
import { pengumpulanService } from "@/services/pengumpulanService";
import { resolveFileUrl } from "@/lib/api";
import { ModalPreviewDokumen } from "./ModalPreviewDokumen";

interface ModalPenilaianTugasProps {
  isOpen: boolean;
  onClose: () => void;
  submission: PengumpulanMahasiswa | null;
  tugas: DetailTugasInfo;
  onSuccess: (updatedItem: PengumpulanMahasiswa) => void;
}

export default function ModalPenilaianTugas({
  isOpen,
  onClose,
  submission,
  tugas,
  onSuccess,
}: ModalPenilaianTugasProps) {
  const [score, setScore] = useState<string>("");
  const [catatan, setCatatan] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);

  useEffect(() => {
    if (submission) {
      setScore(submission.nilai !== null && submission.nilai !== undefined ? String(submission.nilai) : "");
      setCatatan(submission.catatan || "");
      setErrorMsg("");
    }
  }, [submission, isOpen]);

  if (!isOpen || !submission) return null;

  const fileUrl = (submission.fileUrl
    ? resolveFileUrl(submission.fileUrl)
    : (submission.id ? resolveFileUrl(`/api/pengumpulan-tugas/${submission.id}/file`) : null)) || "#";
  const fileDisplay = (submission.fileName || "Laporan_Proyek_Klasifikasi Data").replace(/\.[^/.]+$/, "");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const numericScore = Number(score);
    if (score === "" || isNaN(numericScore)) {
      setErrorMsg("Nilai harus berupa angka valid.");
      return;
    }

    if (numericScore < 0 || numericScore > 100) {
      setErrorMsg("Nilai harus berada dalam rentang 0 sampai 100.");
      return;
    }

    try {
      setLoading(true);
      await pengumpulanService.updateNilai(submission.id, numericScore, catatan);

      const updated: PengumpulanMahasiswa = {
        ...submission,
        nilai: numericScore,
        statusPenilaian: "Sudah Dinilai",
        catatan: catatan || undefined,
      };

      onSuccess(updated);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menyimpan nilai pengumpulan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
        {/* 1. Header Dark Navy Persis Gambar */}
        <div className="bg-[#182B4E] text-white p-4 px-6 flex items-start justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-300">
              Pengumpulan Tugas Mahasiswa
            </p>
            <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
              {tugas.judul || "Proyek Klasifikasi Data"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Body Modal */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Kotak Info Mahasiswa */}
          <div className="bg-[#F0F4FC] dark:bg-slate-800/60 rounded-xl p-3.5 space-y-0.5 border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {submission.studentName}
            </h3>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {submission.nim} • Dikumpulkan: {submission.waktuPengumpulan}
            </p>
          </div>

          {/* Lampiran Tugas */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Lampiran Tugas
            </label>
            <div className="bg-[#FEE2E2] dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 truncate pr-2">
                <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 truncate" title={(submission.fileName || fileDisplay) || undefined}>
                  {fileDisplay}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline shrink-0 cursor-pointer"
              >
                Lihat Dokumen
              </button>
            </div>
          </div>

          {/* Input Nilai Penilaian (0-100) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Beri Penilaian (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              required
              placeholder="contoh: 95"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full bg-[#DBEAFE] dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tombol Simpan Nilai Dark Navy */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#182B4E] hover:bg-[#12203b] shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Simpan Nilai</span>
            </button>
          </div>
        </form>

        {/* Modal Preview Dokumen Terintegrasi (Bebas IDM Hijack) */}
        <ModalPreviewDokumen
          isOpen={showPreview}
          submission={submission}
          onClose={() => setShowPreview(false)}
        />
      </div>
    </div>
  );
}
