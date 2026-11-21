import { apiFetch } from "@/lib/api";
import { Task, TugasItem, CreateTugasPayload } from "@/types/tugas";

export const getTugas = async (): Promise<Task[]> => {
  const data = await apiFetch<any>("/tugas", { method: "GET" });
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
};

export const getTugasByClass = async (classId: string | number): Promise<TugasItem[]> => {
  const data = await apiFetch<any>(`/tugas/class/${classId}`, { method: "GET" });
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
};

export const createTugas = async (tugasData: CreateTugasPayload): Promise<TugasItem> => {
  const data = await apiFetch<any>("/tugas", {
    method: "POST",
    body: JSON.stringify(tugasData),
  });
  return data?.data || data;
};

export const deleteTugas = async (id: string | number): Promise<unknown> => {
  return apiFetch(`/tugas/${id}`, {
    method: "DELETE",
  });
};

export const tugasService = {
  getTugas,
  getTugasByClass,
  createTugas,
  deleteTugas,
};
