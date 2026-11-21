export interface StudentAttendance {
  id: string;
  name: string;
  nim: string;
  status: "Hadir" | "Izin" | "Sakit" | "Alpha";
  course?: string;
  kelasId?: string;
  nomor?: number;
  finalScore?: number;
  gradeHistory?: string;
  notes?: string;
}

export interface StudentGrade {
  id: string;
  name: string;
  nim: string;
  tugas: number;
  kuis: number;
  uts: number;
  uas: number;
  kehadiran: string;
  catatan: string;
}

export interface EvaluationItem {
  id: string;
  studentName: string;
  nim: string;
  score: number;
  notes: string;
}
