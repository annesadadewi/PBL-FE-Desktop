"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { pengumpulanService } from "@/services/pengumpulanService";
import { resolveFileUrl } from "@/lib/api";
import { PengumpulanMahasiswa } from "@/types/tugas";

interface FormPengumpulanTugasProps {
  taskId: string;
  onSubmitted?: () => void;
}

const ACCEPTED_EXTENSIONS =
  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar,.png,.jpg,.jpeg,.webp";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export default function FormPengumpulanTugas({
  taskId,
  onSubmitted,
}: FormPengumpulanTugasProps) {
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [submission, setSubmission] = useState<PengumpulanMahasiswa | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [linkRepo, setLinkRepo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMySubmission = async () => {
    try {
      setLoadingInitial(true);
      const res = await pengumpulanService.getMyPengumpulan(taskId);
      setSubmission(res.data || null);
      if (res.data?.linkRepo) {
        setLinkRepo(res.data.linkRepo);
      }
    } catch (err: any) {
      // Abaikan jika belum login atau belum ada pengumpulan
      console.warn("Gagal memuat status pengumpulan saya:", err?.message || err);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      loadMySubmission();
    }
  }, [taskId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg("");
    setSuccessMsg("");
    const file = e.target.files?.[0] || null;
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg("Ukuran file terlalu besar. Maksimal ukuran file adalah 10MB.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const trimmedRepo = linkRepo.trim();
    if (!selectedFile && !trimmedRepo) {
      setErrorMsg("Pilih file tugas atau masukkan tautan repository terlebih dahulu.");
      return;
    }

    if (trimmedRepo && !/^https?:\/\/.+/i.test(trimmedRepo)) {
      setErrorMsg("Tautan repository harus diawali dengan http:// atau https://.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await pengumpulanService.submitPengumpulan(taskId, {
        file: selectedFile,
        linkRepo: trimmedRepo || undefined,
      });

      setSubmission(res.data);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSuccessMsg(res.message || "Tugas berhasil dikumpulkan ke Cloudinary!");
      onSubmitted?.();
    } catch (err: any) {
      setErrorMsg(err?.message || "Gagal mengirim pengumpulan tugas.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin membatalkan pengumpulan tugas ini?")) return;

    try {
      setDeleting(true);
      setErrorMsg("");
      setSuccessMsg("");
      await pengumpulanService.deleteMyPengumpulan(taskId);
      setSubmission(null);
      setSelectedFile(null);
      setLinkRepo("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSuccessMsg("Pengumpulan tugas berhasil dibatalkan.");
      onSubmitted?.();
    } catch (err: any) {
      setErrorMsg(err?.message || "Gagal membatalkan pengumpulan tugas.");
    } finally {
      setDeleting(false);
    }
  };

  const isGraded =
    submission?.statusPenilaian === "Sudah Dinilai" ||
    (submission?.nilai !== null && submission?.nilai !== undefined);
  const existingFileHref = resolveFileUrl(submission?.fileUrl);

  return (
    <div className="bg-[#CBE0FF] rounded-2xl p-5 shadow-sm space-y-4 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#1B365D]">
            Pengumpulan Tugas Saya
          </h2>
          <p className="text-xs text-slate-700 font-medium">
            Unggah file tugas Anda (disimpan otomatis di Cloudinary, maks. 10MB).
          </p>
        </div>

        {!loadingInitial && (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full w-fit ${
              submission
                ? isGraded
                  ? "bg-[#C7F0C2] text-[#1E4620]"
                  : "bg-blue-100 text-[#1B365D]"
                : "bg-[#FEF7B9] text-[#7A6A00]"
            }`}
          >
            {submission
              ? isGraded
                ? `Sudah Dinilai (${submission.nilai}/100)`
                : `Sudah Dikumpulkan (${submission.statusWaktu})`
              : "Belum Dikumpulkan"}
          </span>
        )}
      </div>

      {loadingInitial ? (
        <div className="bg-[#E9F2FF] rounded-xl p-6 flex items-center justify-center gap-2 text-xs text-slate-600 font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-[#1B365D]" />
          <span>Memeriksa status pengumpulan Anda...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Ringkasan File yang Sudah Dikumpulkan */}
          {submission && (
            <div className="bg-[#E9F2FF] rounded-xl p-4 space-y-2.5 border border-blue-200">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-[#1B365D]">
                  Lampiran Terkirim ({submission.waktuPengumpulan})
                </p>
                {!isGraded && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer disabled:opacity-50"
                  >
                    {deleting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>Batalkan Pengumpulan</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {existingFileHref && (
                  <a
                    href={existingFileHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#FFF0F0] border border-[#FFCDD2] text-[#D32F2F] rounded-lg px-3 py-1.5 text-xs font-semibold hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="max-w-[240px] truncate">
                      {submission.fileName || "Lihat File Tugas"}
                    </span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                )}

                {submission.linkRepo && (
                  <a
                    href={submission.linkRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold hover:underline"
                  >
                    <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="max-w-[240px] truncate">{submission.linkRepo}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Form Upload File ke Cloudinary */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#E9F2FF] rounded-xl p-4 space-y-4 border border-blue-200"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                {submission ? "Ganti File Tugas (Opsional)" : "Unggah File Tugas"}
              </label>

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#8DB5F8] bg-white/80 hover:bg-white rounded-xl p-5 cursor-pointer transition-colors">
                <UploadCloud className="w-7 h-7 text-[#1B365D] mb-1.5" />
                <span className="text-xs font-semibold text-slate-800 text-center">
                  {selectedFile
                    ? selectedFile.name
                    : "Klik untuk memilih file (PDF, DOCX, PPTX, ZIP, RAR, PNG, JPG)"}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  {selectedFile
                    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                    : "Maksimal ukuran file 10MB"}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_EXTENSIONS}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Tautan Repository / Drive (Opsional)
              </label>
              <input
                type="url"
                value={linkRepo}
                onChange={(e) => setLinkRepo(e.target.value)}
                placeholder="https://github.com/username/nama-repo"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-[#1B365D] hover:bg-[#152a48] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-60"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {submitting
                    ? "Mengunggah ke Cloudinary..."
                    : submission
                      ? "Perbarui Pengumpulan"
                      : "Kirim Tugas"}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
