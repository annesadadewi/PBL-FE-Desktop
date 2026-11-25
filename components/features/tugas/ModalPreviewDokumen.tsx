"use client";

import React, { useEffect, useState } from "react";
import { X, ExternalLink, Download, FileText, Loader2, Maximize2, AlertCircle } from "lucide-react";
import { PengumpulanMahasiswa } from "@/types/tugas";
import { resolveFileUrl } from "@/lib/api";

interface ModalPreviewDokumenProps {
  isOpen: boolean;
  onClose: () => void;
  submission: PengumpulanMahasiswa | null;
  onOpenPenilaian?: (submission: PengumpulanMahasiswa) => void;
}

export function ModalPreviewDokumen({
  isOpen,
  onClose,
  submission,
  onOpenPenilaian,
}: ModalPreviewDokumenProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const rawUrl = submission?.fileUrl || (submission?.id ? `/api/pengumpulan-tugas/${submission.id}/file` : null);
  const fileUrl = rawUrl ? resolveFileUrl(rawUrl) : null;
  const fileName = submission?.fileName || "Dokumen Tugas";
  const ext = (fileName.split(".").pop() || "").toLowerCase();

  useEffect(() => {
    let active = true;
    let createdUrl: string | null = null;

    if (!isOpen || !fileUrl) {
      setBlobUrl(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Ambil isi berkas sebagai JSON base64 (bukan application/pdf), lalu rakit ulang jadi Blob
    // di memori. IDM hanya mencegat respons ber-Content-Type dokumen/media, sehingga JSON
    // tidak pernah dicegat — mirip cara viewer in-app Google Classroom.
    const previewUrl = submission?.id
      ? resolveFileUrl(`/api/pengumpulan-tugas/${submission.id}/preview`)
      : null;

    if (!previewUrl) {
      setError("Berkas tidak tersedia.");
      setLoading(false);
      return;
    }

    fetch(previewUrl)
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.success) {
          setError(json?.message || `Gagal memuat berkas (status ${res.status})`);
          setLoading(false);
          return null;
        }
        return json.data as { mimeType: string; base64: string };
      })
      .then((data) => {
        if (!active || !data) return;
        const binary = atob(data.base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const fileBlob = new Blob([bytes], { type: data.mimeType });
        createdUrl = URL.createObjectURL(fileBlob);
        setBlobUrl(createdUrl);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error("[PREVIEW FETCH ERROR]:", err);
        setError("Gagal menghubungi server untuk memuat berkas.");
        setLoading(false);
      });

    return () => {
      active = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [isOpen, fileUrl, ext]);

  if (!isOpen || !submission) return null;

  const isPdf = ext === "pdf";
  const isImage = ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext);
  const isVideo = ["mp4", "webm", "mov"].includes(ext);
  const isAudio = ["mp3", "wav", "m4a", "ogg"].includes(ext);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111827] w-full max-w-5xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        {/* Header Preview Ala Google Classroom */}
        <div className="bg-[#182B4E] text-white p-3.5 px-6 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="p-2 bg-white/10 rounded-xl shrink-0">
              <FileText className="w-5 h-5 text-blue-300" />
            </div>
            <div className="truncate">
              <h2 className="text-sm font-bold text-white truncate leading-tight" title={fileName}>
                {fileName}
              </h2>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                {submission.studentName} ({submission.nim}) • {submission.waktuPengumpulan}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenPenilaian && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPenilaian(submission);
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer shadow-xs"
              >
                {submission.statusPenilaian === "Sudah Dinilai" ? "Ubah Nilai" : "Beri Nilai"}
              </button>
            )}

            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={fileName}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Unduh Berkas Asli"
              >
                <Download className="w-4 h-4" />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Tutup Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 bg-slate-100 dark:bg-[#0B1120] relative overflow-hidden flex items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
              <p className="text-xs font-semibold">Memuat pratinjau dokumen...</p>
            </div>
          )}

          {!loading && error && (
            <div className="p-6 text-center max-w-md">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{error}</p>
              {fileUrl && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka langsung di tab baru
                </a>
              )}
            </div>
          )}

          {!loading && !error && blobUrl && (
            <>
              {isPdf && (
                <iframe
                  src={`${blobUrl}#toolbar=1&navpanes=0`}
                  title={fileName}
                  className="w-full h-full border-0"
                />
              )}

              {isImage && (
                <div className="w-full h-full p-4 flex items-center justify-center overflow-auto">
                  <img
                    src={blobUrl}
                    alt={fileName}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                  />
                </div>
              )}

              {isVideo && (
                <div className="w-full h-full p-6 flex items-center justify-center bg-black">
                  <video controls className="max-w-full max-h-full rounded-lg shadow-md">
                    <source src={blobUrl} />
                    Browser Anda tidak mendukung pemutar video ini.
                  </video>
                </div>
              )}

              {isAudio && (
                <div className="p-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 text-center space-y-4">
                  <FileText className="w-12 h-12 text-indigo-500 mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">{fileName}</h4>
                    <p className="text-xs text-slate-400 mt-1">Berkas Rekaman / Audio</p>
                  </div>
                  <audio controls className="w-full">
                    <source src={blobUrl} />
                    Browser Anda tidak mendukung pemutar audio ini.
                  </audio>
                </div>
              )}

              {!isPdf && !isImage && !isVideo && !isAudio && (
                <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 max-w-md space-y-3">
                  <FileText className="w-12 h-12 text-blue-500 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">{fileName}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Berkas dengan format ini belum mendukung pratinjau langsung di dalam browser.
                  </p>
                  <a
                    href={fileUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#182B4E] hover:bg-[#12203b] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh Berkas
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
