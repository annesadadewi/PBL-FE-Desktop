// API base URL (bisa di‑override lewat env NEXT_PUBLIC_API_URL)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Helper fetch yang otomatis menambahkan token JWT (jika ada) dan meng‑handle error.
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token =
      localStorage.getItem("token") ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1] ||
      null;
  }

  const headers: Record<string, string> = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Terjadi kesalahan pada server (${response.status})`);
  }
  return data as T;
}

// ------------------------------------------------------------------
// Helper API functions used oleh UI dosen untuk meng‑update data
// ------------------------------------------------------------------

/** Attendance */
export const createAttendance = (payload: any) =>
  apiFetch('/kehadiran', { method: 'POST', body: JSON.stringify(payload) });
export const deleteAttendance = (id: string) =>
  apiFetch(`/kehadiran/${id}`, { method: 'DELETE' });

/** Task */
export const createTask = (payload: any) =>
  apiFetch('/tugas', { method: 'POST', body: JSON.stringify(payload) });
export const deleteTask = (id: string) =>
  apiFetch(`/tugas/${id}`, { method: 'DELETE' });

/** Grade (penilaian) */
export const createGrade = (payload: any) =>
  apiFetch('/penilaian', { method: 'POST', body: JSON.stringify(payload) });
export const deleteGrade = (id: string) =>
  apiFetch(`/penilaian/${id}`, { method: 'DELETE' });

/** Notification fetch for mahasiswa */
export const fetchNotifications = () => apiFetch('/notifications');
