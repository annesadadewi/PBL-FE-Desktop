"use client";

import React, { useEffect, useState } from "react";
import { getTugasByClass, createTugas } from "@/services/tugasService";
import { TugasItem } from "@/types/tugas";

interface TugasManagementProps {
  classId: string | number;
}

export default function TugasManagement({ classId }: TugasManagementProps) {
  const [tugasList, setTugasList] = useState<TugasItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [deadline, setDeadline] = useState("");

  const fetchTugas = async () => {
    try {
      setLoading(true);
      const data = await getTugasByClass(classId);
      setTugasList(data);
      setLoading(false);
    } catch {
      setError("Gagal memuat daftar tugas.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchTugas();
    }
  }, [classId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedJudul = judul.trim();
    if (!trimmedJudul) {
      setError("Judul tugas wajib diisi.");
      return;
    }
    if (trimmedJudul.length < 3) {
      setError("Judul tugas minimal 3 karakter.");
      return;
    }
    if (!deadline) {
      setError("Tenggat waktu wajib diisi.");
      return;
    }

    try {
      await createTugas({
        class_id: classId,
        judul: trimmedJudul,
        deskripsi,
        deadline,
      });
      setJudul("");
      setDeskripsi("");
      setDeadline("");
      fetchTugas(); // Refresh daftar tugas setelah berhasil submit
    } catch {
      setError("Gagal membuat tugas baru.");
    }
  };

  if (loading) return <p className="text-gray-500">Memuat tugas...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Form Buat Tugas */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-slate-800">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Tambah Tugas Baru</h3>
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Judul Tugas
            </label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full mt-1 p-2 border dark:border-slate-700 dark:bg-slate-800 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Deskripsi / Instruksi
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full mt-1 p-2 border dark:border-slate-700 dark:bg-slate-800 rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tenggat Waktu (Deadline)
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full mt-1 p-2 border dark:border-slate-700 dark:bg-slate-800 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Simpan Tugas
          </button>
        </form>
      </div>

      {/* Daftar Tugas */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Daftar Tugas Kelas</h3>
        {tugasList.length === 0 ? (
          <p className="text-gray-500">Belum ada tugas untuk kelas ini.</p>
        ) : (
          <div className="space-y-3">
            {tugasList.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white">{item.judul || item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.deskripsi || item.description}</p>
                {item.deadline && (
                  <p className="text-xs text-red-500 font-medium mt-2">
                    Deadline: {new Date(item.deadline).toLocaleString("id-ID")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
