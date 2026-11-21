export interface ClassItem {
  id?: string | number;
  _id?: string;
  name?: string;
  nama_kelas?: string;
  classCode?: string;
  kode_kelas?: string;
  students?: string | number;
  schedule?: string;
  progress?: string;
  progressBg?: string;
  sks?: number;
  dosen_id?: string | number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface CreateClassPayload {
  name?: string;
  nama_kelas?: string;
  classCode?: string;
  kode_kelas?: string;
  students?: string | number;
  schedule?: string;
  sks?: number;
}
