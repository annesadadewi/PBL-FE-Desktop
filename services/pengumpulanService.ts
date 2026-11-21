import { apiFetch } from "@/lib/api";
import { PengumpulanTugasDetailResponse } from "@/types/tugas";

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
