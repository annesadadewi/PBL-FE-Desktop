import React, { useEffect, useState } from 'react';
import { getClasses } from '../services/classService';

export default function ClassList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data.data || data);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat data kelas dari server.');
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) return <p className="text-gray-500">Memuat data kelas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Daftar Kelas Ajar</h2>
      
      {classes.length === 0 ? (
        <p className="text-gray-500">Belum ada kelas yang terdaftar.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div key={cls.id || cls.kode_kelas} className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-blue-600">{cls.nama_kelas}</h3>
              <p className="text-gray-600 text-sm mt-1">Kode Kelas: <span className="font-medium">{cls.kode_kelas}</span></p>
              <p className="text-gray-500 text-sm mt-2">SKS: {cls.sks}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}