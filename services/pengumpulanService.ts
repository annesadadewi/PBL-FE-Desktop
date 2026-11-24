import { apiFetch } from "@/lib/api";
import { PengumpulanMahasiswa, PengumpulanTugasDetailResponse } from "@/types/tugas";

export interface MyPengumpulanResponse {
  success: boolean;
  submitted: boolean;
  data: PengumpulanMahasiswa | null;
}

export interface SubmitPengumpulanResponse {
  success: boolean;
  message: string;
  data: PengumpulanMahasiswa & {
    cloudinary?: {
      publicId: string;
      resourceType: "image" | "raw";
      bytes: number;
    } | null;
  };
}

export const pengumpulanService = {
  /**
   * Mengambil detail tugas, statistik pengumpulan, dan daftar submission mahasiswa
   */
  async getPengumpulanByTugasId(taskId: string): Promise<PengumpulanTugasDetailResponse> {
    const res = await apiFetch<any>(`/tugas/${taskId}/pengumpulan`, {
      method: "GET",
    });

    if (res?.data) {
      return res.data as PengumpulanTugasDetailResponse;
    }
    return res as PengumpulanTugasDetailResponse;
  },

  /**
   * Mengambil data pengumpulan milik mahasiswa yang sedang login untuk tugas tertentu
   */
  async getMyPengumpulan(taskId: string): Promise<MyPengumpulanResponse> {
    return apiFetch<MyPengumpulanResponse>(`/tugas/${taskId}/pengumpulan/me`, {
      method: "GET",
    });
  },

  /**
   * Mengirim atau memperbarui pengumpulan tugas mahasiswa (file diunggah ke Cloudinary di backend)
   */
  async submitPengumpulan(
    taskId: string,
    payload: { file?: File | null; linkRepo?: string },
  ): Promise<SubmitPengumpulanResponse> {
    const formData = new FormData();
    if (payload.file) {
      formData.append("file", payload.file);
    }
    if (payload.linkRepo && payload.linkRepo.trim()) {
      formData.append("linkRepo", payload.linkRepo.trim());
    }

    return apiFetch<SubmitPengumpulanResponse>(`/tugas/${taskId}/pengumpulan`, {
      method: "POST",
      body: formData,
    });
  },

  /**
   * Membatalkan/menghapus pengumpulan tugas milik mahasiswa login (menghapus file di Cloudinary juga)
   */
  async deleteMyPengumpulan(taskId: string): Promise<{ success: boolean; message: string }> {
    return apiFetch<{ success: boolean; message: string }>(`/tugas/${taskId}/pengumpulan`, {
      method: "DELETE",
    });
  },

  /**
   * Menyimpan / memperbarui nilai pengumpulan mahasiswa (skor 0-100)
   */
  async updateNilai(submissionId: string, nilai: number, catatan?: string): Promise<any> {
    return apiFetch(`/pengumpulan-tugas/${submissionId}/nilai`, {
      method: "PATCH",
      body: JSON.stringify({
        nilai,
        catatan,
      }),
    });
  },
};
