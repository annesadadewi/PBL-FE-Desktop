"use client";

import React, { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Memastikan browser siap membaca localStorage
    setIsReady(true);
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