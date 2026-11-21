export interface Task {
  id: number | string;
  subject: string;
  title: string;
  dueDate: string;
  submittedCount: number;
  totalStudents: number;
  status: string;
  class_name?: string;
  class_code?: string;
  dosen_name?: string;
  deadline?: string;
  deadline_text?: string;
  description?: string;
}

export interface TugasItem {
  id: string | number;
  judul: string;
  title?: string;
  deskripsi?: string;
  description?: string;
  deadline?: string;
  deadlineText?: string;
  category?: string;
  lampiran?: string | null;
  kelasId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTugasPayload {
  class_id?: string | number;
  kelasId?: string | number;
  title?: string;
  judul?: string;
  description?: string;
  deskripsi?: string;
  deadline?: string;
  deadline_text?: string;
  category?: string;
  attachment_name?: string | null;
}

export interface PengumpulanMahasiswa {
  id: string;
  taskId: string;
  studentId: string;
  studentName: string;
  namaMahasiswa: string;
  nim: string;
  submittedAt: string;
  waktuPengumpulan: string;
  statusWaktu: 'Tepat Waktu' | 'Terlambat';
  fileName?: string;
  fileUrl?: string;
  linkRepo?: string;
  nilai?: number | null;
  statusPenilaian: 'Sudah Dinilai' | 'Belum Dinilai';
  catatan?: string;
}

export interface DetailTugasInfo {
  id: string;
  judul: string;
  deskripsi?: string;
  deadline?: string;
  deadlineText?: string;
  category?: string;
  status?: string;
  mataKuliah?: string;
  kodeKelas?: string;
  kelasId?: string;
  dosenName?: string;
}

export interface RingkasanStatistik {
  totalMahasiswa: number;
  jumlahTerkumpul: number;
  persentaseTerkumpul: number;
  sudahDinilai: number;
  belumDinilai: number;
}

export interface PengumpulanTugasDetailResponse {
  tugas: DetailTugasInfo;
  statistik: RingkasanStatistik;
  daftarPengumpulan: PengumpulanMahasiswa[];
}
