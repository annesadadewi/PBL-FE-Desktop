"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { apiFetch } from "@/lib/api"; //

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Panggil endpoint login backend
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: identifier, // mengirim input Email / NIP sebagai email ke backend
          password: password,
        }),
      });

      // Simpan JWT token dan data user ke LocalStorage[cite: 2]
      if (res.token) {
        localStorage.setItem("token", res.token); //[cite: 2]
        localStorage.setItem("user", JSON.stringify(res.user)); //[cite: 2]
      }

      // Navigasi ke halaman dashboard
      router.push("/dashboard");
    } catch (error: any) {
      setErrorMessage(error.message || "Gagal login. Periksa kembali email dan password Anda.");
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

      {/* Kolom Kiri - Panel Dark Navy (Full Height) */}
      <div className="w-full md:w-1/2 bg-[#1A2E53] p-10 md:p-16 text-white flex flex-col justify-between min-h-[50vh] md:min-h-screen">
        
        {/* Logo Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-10 flex items-center justify-center">
            {/* Sinar Oranye / Matahari di atas Buku */}
            <div className="absolute -top-1.5 w-3.5 h-3.5 bg-orange-400 rounded-full blur-[0.5px]" />
            <div className="absolute -top-3 w-1 h-2 bg-orange-400/80 rounded-full" />
            <div className="absolute -top-2 -left-2 w-1 h-2 bg-orange-400/80 rounded-full -rotate-45" />
            <div className="absolute -top-2 -right-2 w-1 h-2 bg-orange-400/80 rounded-full rotate-45" />
            
            {/* Ikon Buku Biru Cerah */}
            <svg className="w-12 h-10 text-[#0066FF] fill-current" viewBox="0 0 24 24">
              <path d="M12 4.5C10 3.2 7 3 4 3 2.5 3 1.5 3.5 1 4v14.5c.5-.5 1.5-1 3-1 3 0 6 .2 8 1.5 2-1.3 5-1.5 8-1.5 1.5 0 2.5.5 3 1V4c-.5-.5-1.5-1-3-1-3 0-6 .2-8 1.5z" />
            </svg>
          </div>
          <span className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            EduInsight
          </span>
        </div>

        {/* Teks Hero */}
        <div className="my-auto py-10 max-w-lg">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white mb-6">
            Sistem Evaluasi &amp;<br />
            Analisis Pembelajaran
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed font-normal">
            Platform tertinggi khusus Dosen untuk memantau Nilai<br />
            Kehadiran serta rekomendasi AI evaluator mahasiswa.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} EduInsight. All rights reserved.
        </div>
      </div>

      {/* Kolom Kanan - Form Login (Full Height) */}
      <div className="w-full md:w-1/2 bg-white dark:bg-slate-900 p-10 md:p-16 flex flex-col justify-center min-h-[50vh] md:min-h-screen">
        <div className="w-full max-w-md mx-auto">
          
          {/* Header Form */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white tracking-tight">
              Selamat Datang!
            </h2>
            <p className="text-base text-slate-400 mt-2 font-normal">
              Masukkan Email / NIP Anda
            </p>
          </div>

          {/* Pesan Error (jika ada) */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form Input */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Field Email / NIP */}
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

            {/* Field Password */}
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
            </div>

            {/* Action Button & Lupa Password */}
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

    </div>
  );
}