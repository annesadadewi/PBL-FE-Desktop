import React, { useEffect, useState } from 'react';
import { getTugasByClass, createTugas } from '../services/tugasService';

export default function TugasManagement({ classId }) {
  const [tugasList, setTugasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (classId) fetchTugas();
  }, [classId]);

  const fetchTugas = async () => {
    try {
      const data = await getTugasByClass(classId);
      setTugasList(data.data || data);
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat daftar tugas.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTugas({
        class_id: classId,
        judul,
        deskripsi,
        deadline,
      });
      setJudul('');
      setDeskripsi('');
      setDeadline('');
      fetchTugas(); // Refresh daftar tugas setelah berhasil submit
    } catch (err) {
      alert('Gagal membuat tugas baru.');
    }
  };

  if (loading) return <p className="text-gray-500">Memuat tugas...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Form Buat Tugas */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Tambah Tugas Baru</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Judul Tugas</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deskripsi / Instruksi</label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tenggat Waktu (Deadline)</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
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
        <h3 className="text-xl font-bold mb-4 text-gray-800">Daftar Tugas Kelas</h3>
        {tugasList.length === 0 ? (
          <p className="text-gray-500">Belum ada tugas untuk kelas ini.</p>
        ) : (
          <div className="space-y-3">
            {tugasList.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900">{item.judul}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.deskripsi}</p>
                <p className="text-xs text-red-500 font-medium mt-2">
                  Deadline: {new Date(item.deadline).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}