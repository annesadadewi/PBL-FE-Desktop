const API_BASE_URL = "http://localhost:5001/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  // Ambil token dari cookie atau localStorage
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || 
      document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1] || null;
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan pada server");
  }

  return data;
}