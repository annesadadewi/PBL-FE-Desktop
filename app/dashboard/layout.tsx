"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Cek ketersediaan token di LocalStorage[cite: 2]
    const token = localStorage.getItem("token");
    if (!token) {
      // Jika token tidak ada, kembalikan ke halaman login
      router.push("/");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#182B4E] flex items-center justify-center text-white font-medium">
        Memeriksa hak akses...
      </div>
    );
  }

  return <>{children}</>;
}