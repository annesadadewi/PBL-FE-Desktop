"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Trash2, 
  Loader2, 
  Download,
  ExternalLink,
  Edit
} from "lucide-react";
import { pengumpulanService } from "@/services/pengumpulanService";
import { PengumpulanMahasiswa } from "@/types/tugas";
import { resolveFileUrl } from "@/lib/api";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface FormPengumpulanTugasProps {
  taskId: string;
  onSubmitted: () => void;
}

export default function FormPengumpulanTugas({
  taskId,
  onSubmitted,
}: FormPengumpulanTugasProps) {
  const [submission, setSubmission] = useState<PengumpulanMahasiswa | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Form Fields
  const [file, setFile] = useState<File | null>(null);
  const [linkRepo, setLinkRepo] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMySubmission = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await pengumpulanService.getMyPengumpulan(taskId);
      if (res && res.submitted && res.data) {
        setSubmission(res.data);
        setLinkRepo(res.data.linkRepo || "");
        setIsEditing(false);
      } else {
        setSubmission(null);
        setIsEditing(true);
      }
    } catch (err: any) {
      console.warn("Gagal mengambil data pengumpulan saya:", err);
      setSubmission(null);
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchMySubmission();
    }
  }, [taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!file && !linkRepo.trim()) {
      setErrorMsg("Harap unggah dokumen berkas atau masukkan tautan repositori.");
      return;
    }

    try {
      setSubmitting(true);
      await pengumpulanService.submitPengumpulan(taskId, {
        file,
        linkRepo: linkRepo.trim() || undefined,
      });

      setSuccessMsg("Tugas berhasil dikumpulkan!");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await fetchMySubmission();
      onSubmitted();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengumpulkan tugas.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin membatalkan pengumpulan tugas ini?")) return;

    try {
      setSubmitting(true);
      await pengumpulanService.deleteMyPengumpulan(taskId);
      setSubmission(null);
      setIsEditing(true);
      setFile(null);
      setLinkRepo("");
      setSuccessMsg("Pengumpulan tugas berhasil dibatalkan.");
      onSubmitted();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal membatalkan pengumpulan.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin text-[#182B4E]" />
        <span className="text-sm font-medium">Memeriksa status pengumpulan tugas Anda...</span>
      </div>
    );
  }

  // Tampilan jika sudah mengumpulkan dan tidak dalam mode edit
  if (submission && !isEditing) {
    const fileUrl = submission.fileUrl ? resolveFileUrl(submission.fileUrl) : null;
    const isGraded = submission.statusPenilaian === "Sudah Dinilai" || (submission.nilai !== null && submission.nilai !== undefined);

    return (
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Tugas Anda Sudah Dikumpulkan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Diserahkan pada {submission.waktuPengumpulan}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              submission.statusWaktu === "Terlambat"
                ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200"
            }`}>
              <Clock className="w-3.5 h-3.5" />
              {submission.statusWaktu}
            </span>

            {/* Tombol Batalkan / Ubah Pengumpulan */}
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Ubah</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Batal Serahkan</span>
            </button>
          </div>
        </div>

        {/* Status Penilaian Dosen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Status Penilaian Dosen:
            </span>
            <div className="flex items-center gap-3">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                isGraded
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200"
              }`}>
                {isGraded ? "Sudah Dinilai" : "Menunggu Evaluasi Dosen"}
              </span>
              {isGraded && (
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {submission.nilai} <span className="text-xs font-normal text-slate-400">/ 100</span>
                </span>
              )}
            </div>
            {submission.catatan && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <strong>Catatan Dosen:</strong> {submission.catatan}
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3 text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              Berkas & Lampiran Terkirim:
            </span>
            {submission.fileName ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 truncate pr-2">
                  <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {submission.fileName}
                  </span>
                </div>
                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh</span>
                  </a>
                )}
              </div>
            ) : (
              <p className="text-slate-400 italic">Tidak ada berkas file diunggah.</p>
            )}

            {submission.linkRepo && (
              <div className="pt-1">
                <a
                  href={submission.linkRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold hover:text-blue-600 transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span className="truncate max-w-[280px]">{submission.linkRepo}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Form input pengumpulan tugas
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {submission ? "Perbarui Pengumpulan Tugas" : "Form Pengumpulan Tugas Mahasiswa"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Unggah dokumen laporan atau masukkan tautan repositori tugas Anda.
          </p>
        </div>

        {submission && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium"
          >
            Batal Ubah
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Input File */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Unggah Berkas Laporan / Tugas (PDF, DOCX, ZIP)
          </label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/30"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              accept=".pdf,.doc,.docx,.zip,.rar,.png,.jpg"
            />
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            {file ? (
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {file.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB - Klik untuk mengganti
                </p>
              </div>
            ) : (
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Klik untuk memilih file dokumen
                </p>
                <p className="text-[11px] text-slate-400">
                  Format PDF, DOCX, atau ZIP (Maksimal 50MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Input Link Repo */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Tautan Repositori GitHub / GitLab (Opsional)
          </label>
          <div className="relative">
            <GithubIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              placeholder="https://github.com/username/nama-repo"
              value={linkRepo}
              onChange={(e) => setLinkRepo(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tombol Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#182B4E] hover:bg-[#12203b] shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{submission ? "Perbarui Pengumpulan" : "Kumpulkan Tugas"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
