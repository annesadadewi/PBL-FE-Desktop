// Wrapper untuk mengamankan Server Action dan memaksa autentikasi
export async function authenticatedAction<T>(
  actionFn: () => Promise<T>
): Promise<T> {
  // Simulasi cek autentikasi dosen
  const isAuthenticated = true; // Set false untuk menguji penolakan akses

  if (!isAuthenticated) {
    throw new Error("Akses ditolak: Pengguna belum login sebagai Dosen.");
  }

  return await actionFn();
}