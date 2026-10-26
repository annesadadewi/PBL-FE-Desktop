"use client";

import React, { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Memastikan browser siap
    setIsReady(true);

    // Fungsi untuk eksekusi logout total
    const executeLogout = () => {
      localStorage.clear();
      sessionStorage.clear();

      // Hapus cookie dengan berbagai kemungkinan atribut path & domain
      document.cookie = "token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "token=; path=/dashboard; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;";

      // Alihkan langsung ke halaman utama/login
      window.location.replace("/");
    };

    // Tangkap klik di seluruh halaman secara global pada fase capture
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Cari elemen terdekat yang diklik (button, link, div, span)
      const clickedElement = target.closest("button, a, div, li, span");
      
      if (clickedElement) {
        const text = clickedElement.textContent || "";
        // Cek jika elemen yang diklik atau teks di dalamnya mengandung kata "keluar" atau "logout"
        if (
          text.toLowerCase().includes("keluar") ||
          text.toLowerCase().includes("logout")
        ) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          executeLogout();
        }
      }
    };

    // Pasang listener dengan capture phase true
    window.addEventListener("click", handleGlobalClick, true);

    return () => {
      window.removeEventListener("click", handleGlobalClick, true);
    };
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#1A2E53] text-white">
        Memuat Dashboard...
      </div>
    );
  }

  return <>{children}</>;
}