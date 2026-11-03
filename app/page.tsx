"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // State untuk mengontrol Modal jika yang login bukan Dosen
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userRole, setUserRole] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: identifier,
          password: password,
        }),
      });

      const token = res?.token || res?.data?.token;
      const user = res?.user || res?.data?.user;

      const role = (user?.role || res?.role || "").toLowerCase();

      if (role && role !== "dosen" && role !== "lecturer") {
        // JIKA BUKAN DOSEN: Tampilkan Pop-up & jangan simpan session
        setUserRole(user?.role || res?.role || "Pengguna");
        setShowRoleModal(true);
      } else if (token) {
        // JIKA DOSEN: Simpan token di localStorage & Cookie
        localStorage.setItem("token", token);
        if (user) localStorage.setItem("user", JSON.stringify(user));

        // PENAMBAHAN COOKIE: Disimpan agar dibaca oleh Middleware Next.js
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;

        window.location.href = "/dashboard";
      } else {
        setErrorMessage(res?.message || "Gagal login. Token tidak ditemukan.");
      }
    } catch (error: any) {
      setErrorMessage(
        error.message || "Gagal login. Periksa kembali email dan password Anda."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row relative">
      {/* Tombol Dark Mode Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Panel Kiri - Dark Navy */}
      <div className="w-full md:w-1/2 bg-[#1A2E53] p-10 md:p-16 text-white flex flex-col justify-between min-h-[50vh] md:min-h-screen">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-10 flex items-center justify-center">
            <div className="absolute -top-1.5 w-3.5 h-3.5 bg-orange-400 rounded-full blur-[0.5px]" />
            <div className="absolute -top-3 w-1 h-2 bg-orange-400/80 rounded-full" />
            <div className="absolute -top-2 -left-2 w-1 h-2 bg-orange-400/80 rounded-full -rotate-45" />
            <div className="absolute -top-2 -right-2 w-1 h-2 bg-orange-400/80 rounded-full rotate-45" />

            <svg
              className="w-12 h-10 text-[#0066FF] fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 4.5C10 3.2 7 3 4 3 2.5 3 1.5 3.5 1 4v14.5c.5-.5 1.5-1 3-1 3 0 6 .2 8 1.5 2-1.3 5-1.5 8-1.5 1.5 0 2.5.5 3 1V4c-.5-.5-1.5-1-3-1-3 0-6 .2-8 1.5z" />
            </svg>
          </div>
          <span className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            EduInsight
          </span>
        </div>

        <div className="my-auto py-10 max-w-lg">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white mb-6">
            Sistem Evaluasi &amp;
            <br />
            Analisis Pembelajaran
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed font-normal">
            Platform tertinggi khusus Dosen untuk memantau Nilai
            <br />
            Kehadiran serta rekomendasi AI evaluator mahasiswa.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} EduInsight. All rights reserved.
        </div>
      </div>

      {/* Panel Kanan - Form Login */}
      <div className="w-full md:w-1/2 bg-white dark:bg-slate-900 p-10 md:p-16 flex flex-col justify-center min-h-[50vh] md:min-h-screen">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white tracking-tight">
              Selamat Datang!
            </h2>
            <p className="text-base text-slate-400 mt-2 font-normal">
              Masukkan Email / NIP Anda
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2"
              >
                Email / NIP
              </label>
              <input
                id="identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-[#3B6DB3] dark:bg-blue-800 text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium text-base transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-[#3B6DB3] dark:bg-blue-800 text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium text-base transition-all"
              />

              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Minimal 8–12 karakter dengan kombinasi huruf besar, huruf kecil, angka, dan simbol.
              </p>
            </div>

            <div className="pt-6 flex flex-col items-center gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-32 py-2.5 px-6 rounded-xl bg-[#60A5FA] hover:bg-blue-500 text-slate-900 font-semibold text-base shadow-md transition-all duration-200 active:scale-95 disabled:opacity-70"
              >
                {isLoading ? "..." : "Login"}
              </button>

              <Link
                href="#"
                className="text-sm font-semibold text-slate-800 dark:text-slate-300 hover:underline transition-all mt-1"
              >
                Lupa Password
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* POP-UP MODAL: Khusus Dosen */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-200 dark:border-slate-700">
            
            {/* Ikon Peringatan / Akses Ditolak */}
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Akses Khusus Dosen
            </h3>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              Aplikasi <span className="font-semibold text-blue-600 dark:text-blue-400">EduInsight</span> saat ini khusus diperuntukkan bagi <span className="font-semibold">Dosen</span>. Akun Anda terdeteksi sebagai <span className="capitalize font-semibold text-amber-600 dark:text-amber-400">{userRole || "Mahasiswa/Admin"}</span>.
            </p>

            <button
              onClick={() => setShowRoleModal(false)}
              className="w-full py-3 px-4 bg-[#1A2E53] hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-md active:scale-95"
            >
              Mengerti &amp; Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}