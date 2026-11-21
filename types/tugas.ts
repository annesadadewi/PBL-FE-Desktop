export interface Task {
  id: number;
  subject: string;
  title: string;
  dueDate: string;
  submittedCount: number;
  totalStudents: number;
  status: "Belum Dinilai" | "Berjalan" | string;
  class_id?: number | string;
  description?: string;
}

export interface TugasItem {
  id?: string | number;
  class_id?: string | number;
  judul?: string;
  title?: string;
  deskripsi?: string;
  description?: string;
  deadline?: string;
  dueDate?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface CreateTugasPayload {
  class_id?: string | number;
  judul?: string;
  deskripsi?: string;
  deadline?: string;
  [key: string]: unknown;
}
