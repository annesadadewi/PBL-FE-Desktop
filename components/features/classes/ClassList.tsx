"use client";

import React, { useEffect, useState } from "react";
import { getClasses } from "@/services/classService";
import { ClassItem } from "@/types/class";

export default function ClassList() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data);
        setLoading(false);
      } catch {
        setError("Gagal memuat data kelas dari server.");
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) return <p className="text-gray-500">Memuat data kelas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Daftar Kelas Ajar</h2>

      {classes.length === 0 ? (
        <p className="text-gray-500">Belum ada kelas yang terdaftar.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div
              key={cls.id || cls.kode_kelas}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {cls.nama_kelas || cls.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                Kode Kelas: <span className="font-medium">{cls.kode_kelas || cls.classCode}</span>
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">SKS: {cls.sks || "-"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
