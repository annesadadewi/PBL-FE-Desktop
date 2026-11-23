"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, CheckCircle2, ChevronDown, X, Loader2 } from "lucide-react";
import CustomSelect from "@/components/CustomSelect";
import { apiFetch } from "@/lib/api";

interface Student {
  id: string;
  name: string;
  nim: string;
  status: "Hadir" | "Izin" | "Sakit" | "Alpha";
  course?: string;
  kelasId?: string;
  nomor?: number;
  finalScore?: number;
  gradeHistory?: string;
  notes?: string;
}

export default function KehadiranPage() {
  const { theme, setTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const pathname = usePathname();

  // State List Kelas dari Backend
  const [classList, setClassList] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState("Pertemuan 1");
  const [searchQuery, setSearchQuery] = useState("");

  // State User Profil dari LocalStorage
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {}
    }
  }, []);

  // Loading & Saving State
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Modal State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Data Mahasiswa Presensi
  const [students, setStudents] = useState<Student[]>([]);

  // Helper mencari ID kelas aktif dan nomor pertemuan aktif
  const activeClass = classList.find((c: any) => {
    const label =
      (c.name || c.nama || "Kelas") +
      (c.classRoom || c.kelas ? ` - ${c.classRoom || c.kelas}` : "");
    return label === selectedCourse || c.name === selectedCourse || c.id === selectedCourse;
  }) || (classList.length > 0 ? classList[0] : null);

  const activeKelasId = activeClass?.id || "";
  const activeNomor = parseInt(selectedMeeting.replace(/\D/g, ""), 10) || 1;

  // 1. Fetch List Kelas untuk Dropdown
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await apiFetch("/classes", { method: "GET" });
        const data = Array.isArray(res) ? res : res.data || [];
        setClassList(data);

        // Ambil query parameter dari URL jika diarahkan dari dashboard
        let targetClass = null;
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const qKelasId = params.get("kelasId") || params.get("class_id") || "";
          const qCourse = params.get("course") || "";
          const qNomor = params.get("nomor") || "";

          if (qNomor) {
            setSelectedMeeting(`Pertemuan ${qNomor}`);
          }

          if (qKelasId || qCourse) {
            targetClass = data.find((c: any) => {
              const cId = String(c.id || "").toLowerCase();
              const cKode = String(c.kodeGabung || c.kode || "").toLowerCase();
              const cName = String(c.name || c.nama || "").toLowerCase();
              const targetId = qKelasId.toLowerCase();
              const targetCourse = qCourse.toLowerCase();

              return (
                (targetId && (cId === targetId || cKode === targetId || cName.includes(targetId))) ||
                (targetCourse && (cName.includes(targetCourse) || targetCourse.includes(cName)))
              );
            });
          }
        }

        if (targetClass) {
          const targetName =
            (targetClass.name || targetClass.nama || "Kelas") +
            (targetClass.classRoom || targetClass.kelas ? ` - ${targetClass.classRoom || targetClass.kelas}` : "");
          setSelectedCourse(targetName);
        } else if (data.length > 0) {
          const defaultName =
            (data[0].name || data[0].nama || "Kelas") +
            (data[0].classRoom ? ` - ${data[0].classRoom}` : "");
          setSelectedCourse(defaultName);
        }
      } catch (err: any) {
        console.error("Gagal mengambil data kelas:", err);
      }
    };
    fetchClasses();
  }, []);

  // 2. Fetch Data Kehadiran dari Backend Express dengan parameter kelasId dan nomor
  const fetchKehadiran = async (targetKelasId?: string, targetNomor?: number) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const kId = targetKelasId || activeKelasId;
      const meetingNum = targetNomor ?? activeNomor;

      const queryParams = new URLSearchParams();
      if (kId) {
        queryParams.append("kelasId", kId);
        queryParams.append("class_id", kId);
      }
      if (meetingNum) {
        queryParams.append("nomor", String(meetingNum));
      }

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
      const res = await apiFetch(`/kehadiran${queryString}`, { method: "GET" });
      const data = Array.isArray(res) ? res : res.data || [];

      // Map data backend ke format interface Student dengan pengaman deduplikasi nama per mahasiswa
      const studentMap = new Map<string, Student>();
      data.forEach((item: any, idx: number) => {
        const sName =
          item.student_name ||
          item.studentName ||
          item.nama_mahasiswa ||
          item.user?.name ||
          item.name ||
          `Mahasiswa ${idx + 1}`;
        const key = sName.toLowerCase().trim();

        if (!studentMap.has(key)) {
          studentMap.set(key, {
            id: String(item.id || item._id || idx + 1),
            name: sName,
            nim: item.nim || item.nim_mahasiswa || `22010100${idx + 1}`,
            status: (item.status === "Alpa" ? "Alpha" : item.status) || "Hadir",
            course: item.course || selectedCourse,
            kelasId: item.kelasId || item.class_id || kId,
            nomor: item.nomor || meetingNum,
            finalScore: item.finalScore || 85.0,
            gradeHistory: item.gradeHistory || "Tugas 88 · Kuis 80 · UTS 84 · UAS 88",
            notes: item.notes || "Aktif dan tepat waktu mengumpulkan tugas",
          });
        }
      });
      const mappedStudents: Student[] = Array.from(studentMap.values());

      // Jika tidak ada data di DB untuk pertemuan ini, tampilkan 4 mahasiswa dengan default Hadir (siap diinput)
      if (mappedStudents.length === 0) {
        setStudents([
          { id: "mhs-brooke", name: "Brooke Everly", nim: "254076512225017", status: "Hadir", course: selectedCourse, kelasId: kId, nomor: meetingNum },
          { id: "mhs-chris", name: "Chris Redfield", nim: "254076512225018", status: "Hadir", course: selectedCourse, kelasId: kId, nomor: meetingNum },
          { id: "mhs-nareswari", name: "Nareswari Ayu", nim: "220101004", status: "Hadir", course: selectedCourse, kelasId: kId, nomor: meetingNum },
          { id: "mhs-sheren", name: "Sheren Annabelle", nim: "220101001", status: "Hadir", course: selectedCourse, kelasId: kId, nomor: meetingNum },
        ]);
      } else {
        setStudents(mappedStudents);
      }
    } catch (err: any) {
      console.error("Gagal memuat kehadiran:", err);
      setErrorMsg("Gagal memuat data presensi dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeKelasId) {
      fetchKehadiran(activeKelasId, activeNomor);
    }
  }, [selectedCourse, selectedMeeting, activeKelasId, activeNomor]);

  // Handler ubah status per mahasiswa di state lokal
  const handleStatusChange = (
    id: string,
    newStatus: "Hadir" | "Izin" | "Sakit" | "Alpha"
  ) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  // Handler Tandai Semua Hadir
  const handleMarkAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: "Hadir" })));
  };

  // 3. Simpan Kehadiran ke Backend Database
  const handleSaveAttendance = async () => {
    try {
      setSaving(true);
      const targetClassId = activeKelasId || "kelas-ai";
      const meetingNum = activeNomor;

      const savePromises = students.map((student) =>
        apiFetch("/kehadiran", {
          method: "POST",
          body: JSON.stringify({
            class_id: targetClassId,
            kelasId: targetClassId,
            student_name: student.name,
            nim: student.nim,
            status: student.status === "Alpha" ? "Alpa" : student.status,
            date: new Date().toISOString().split("T")[0],
            nomor: meetingNum,
            matkul_name: activeClass?.name || selectedCourse,
          }),
        })
      );
      await Promise.all(savePromises);
      alert("Data kehadiran berhasil disimpan ke database!");
      fetchKehadiran(targetClassId, meetingNum);
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan data kehadiran");
    } finally {
      setSaving(false);
    }
  };

  // Filter pencarian
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nim.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Kalkulasi Ringkasan Status Hadir, Izin, Sakit, Alpha dengan filter kelasId & nomor pertemuan
  const countStatus = (statusType: "Hadir" | "Izin" | "Sakit" | "Alpha") => {
    return filteredStudents.filter((s) => {
      // Pastikan data mahasiswa sesuai dengan kelasId dan nomor pertemuan aktif jika ada
      if (activeKelasId && s.kelasId && s.kelasId !== activeKelasId) return false;
      if (activeNomor && s.nomor && s.nomor !== activeNomor) return false;

      if (statusType === "Alpha") {
        return s.status === "Alpha" || (s.status as any) === "Alpa";
      }
      return s.status === statusType;
    }).length;
  };

  // Pilihan nama kelas untuk CustomSelect
  const courseOptions =
    classList.length > 0
      ? classList.map(
          (c) =>
            (c.name || c.nama || "Kelas") +
            (c.classRoom || c.kelas ? ` - ${c.classRoom || c.kelas}` : "")
        )
      : [
          "Pemrograman Framework - Kelas A",
          "Mobile - Kelas D",
          "Kecerdasan Buatan - Kelas C",
          "Jaringan Komputer - Kelas G",
        ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white flex flex-col md:flex-row font-sans transition-colors duration-200">
      
      {/* ---------------- SIDEBAR LEFT ---------------- */}
      <aside className="w-full md:w-64 bg-[#182B4E] text-white flex flex-col justify-between shrink-0 md:h-screen md:sticky md:top-0 md:overflow-y-auto relative z-20">
        <div>
          {/* Logo Brand */}
          <div className="p-6 flex items-center gap-3">
            <div className="relative w-10 h-8 flex items-center justify-center">
              <div className="absolute -top-1 w-3 h-3 bg-orange-400 rounded-full blur-[0.5px]" />
              <svg className="w-10 h-8 text-[#0066FF] fill-current" viewBox="0 0 24 24">
                <path d="M12 4.5C10 3.2 7 3 4 3 2.5 3 1.5 3.5 1 4v14.5c.5-.5 1.5-1 3-1 3 0 6 .2 8 1.5 2-1.3 5-1.5 8-1.5 1.5 0 2.5.5 3 1V4c-.5-.5-1.5-1-3-1-3 0-6 .2-8 1.5z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              EduInsight
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 space-y-1.5 text-sm font-medium">
            <Link
              href="/dashboard"
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                pathname === "/dashboard"
                  ? "bg-[#3B6DB3] text-white font-semibold shadow-sm"
                  : "text-slate-200 hover:bg-blue-900/50 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/kelas-saya"
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                pathname === "/kelas-saya"
                  ? "bg-[#3B6DB3] text-white font-semibold shadow-sm"
                  : "text-slate-200 hover:bg-blue-900/50 hover:text-white"
              }`}
            >
              Kelas Saya
            </Link>
            <Link
              href="/kehadiran"
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                pathname === "/kehadiran"
                  ? "bg-[#3B6DB3] text-white font-semibold shadow-sm"
                  : "text-slate-200 hover:bg-blue-900/50 hover:text-white"
              }`}
            >
              Kehadiran
            </Link>
            <Link
              href="/penilaian"
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                pathname === "/penilaian"
                  ? "bg-[#3B6DB3] text-white font-semibold shadow-sm"
                  : "text-slate-200 hover:bg-blue-900/50 hover:text-white"
              }`}
            >
              Penilaian
            </Link>
            <Link
              href="/evaluator"
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                pathname === "/evaluator"
                  ? "bg-[#3B6DB3] text-white font-semibold shadow-sm"
                  : "text-slate-200 hover:bg-blue-900/50 hover:text-white"
              }`}
            >
              AI Student Evaluator
            </Link>
            <Link
              href="/tugas"
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                pathname === "/tugas"
                  ? "bg-[#3B6DB3] text-white font-semibold shadow-sm"
                  : "text-slate-200 hover:bg-blue-900/50 hover:text-white"
              }`}
            >
              Tugas
            </Link>
            <Link
              href="/kalender"
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                pathname === "/kalender"
                  ? "bg-[#3B6DB3] text-white font-semibold shadow-sm"
                  : "text-slate-200 hover:bg-blue-900/50 hover:text-white"
              }`}
            >
              Kalender Akademik
            </Link>
            <Link
              href="/pengaturan"
              className={`flex items-center px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                pathname === "/pengaturan"
                  ? "bg-[#3B6DB3] text-white font-semibold shadow-sm"
                  : "text-slate-200 hover:bg-blue-900/50 hover:text-white"
              }`}
            >
              Pengaturan
            </Link>
          </nav>
        </div>

        {/* Footer Sidebar & Theme Switcher */}
        <div className="p-6 relative">
          {showThemeMenu && (
            <div className="absolute bottom-16 left-6 w-48 bg-[#CBE0FE] text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-blue-200 p-1.5 space-y-1 z-30 transition-all">
              <button
                type="button"
                onClick={() => {
                  setTheme("light");
                  setShowThemeMenu(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  theme === "light"
                    ? "bg-[#3B6DB3] text-white shadow-sm"
                    : "hover:bg-blue-200/60 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sun className="w-4 h-4" />
                  <span>Light</span>
                </div>
                {theme === "light" && <CheckCircle2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme("dark");
                  setShowThemeMenu(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  theme === "dark"
                    ? "bg-[#3B6DB3] text-white shadow-sm"
                    : "hover:bg-blue-200/60 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Moon className="w-4 h-4" />
                  <span>Dark</span>
                </div>
                {theme === "dark" && <CheckCircle2 className="w-4 h-4" />}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-blue-900/50 transition-all focus:outline-none cursor-pointer"
            aria-label="Toggle Theme Menu"
          >
            <Sun className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT AREA ---------------- */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-black transition-colors duration-200">
        
        {/* TOP HEADER BAR */}
        <header className="h-20 bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between shrink-0">
          <h1 className="text-xl md:text-2xl font-bold text-black dark:text-white tracking-tight">
            Semester Ganjil 2026/2027
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-bold text-black dark:text-white leading-tight">
                {user?.name || user?.nama || "Dosen Pengampu"}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {user?.fakultas || "Fakultas Vokasi"}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#182B4E] text-white flex items-center justify-center font-bold text-base shadow-sm">
              {(user?.name || user?.nama || "D").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <div className="p-8 space-y-6 overflow-y-auto relative">
          
          {/* TITLE & HEADER BUTTONS */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
                Administrasi Pertemuan
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
                Kehadiran Mahasiswa
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Pilih kelas dan pertemuan, lalu pastikan status seluruh mahasiswa sebelum menyimpan
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-5 py-2.5 rounded-xl bg-[#294371] hover:bg-blue-900 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
              >
                Tandai Semua Hadir
              </button>
              <button
                type="button"
                onClick={handleSaveAttendance}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-[#294371] hover:bg-blue-900 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-2"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Simpan Kehadiran</span>
              </button>
            </div>
          </div>

          {/* FILTER CONTAINER (LIGHT BLUE CONTAINER) */}
          <div className="bg-[#CBE0FE] p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
            {/* Filter 1: Mata Kuliah */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Mata Kuliah
              </label>
              <div className="relative">
                <CustomSelect
                  options={courseOptions}
                  value={selectedCourse}
                  onChange={(val) => setSelectedCourse(val)}
                />
              </div>
            </div>

            {/* Filter 2: Pertemuan */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Pertemuan
              </label>
              <div className="relative">
                <CustomSelect
                  options={[
                    "Pertemuan 7",
                    "Pertemuan 6",
                    "Pertemuan 5",
                    "Pertemuan 4",
                    "Pertemuan 3",
                    "Pertemuan 2",
                    "Pertemuan 1",
                  ]}
                  value={selectedMeeting}
                  onChange={(val) => setSelectedMeeting(val)}
                />
              </div>
            </div>

            {/* Filter 3: Cari Mahasiswa */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Cari Mahasiswa
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari Nama / NIM"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#294371] text-white placeholder-slate-400 text-xs font-medium py-2.5 px-4 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* STATS CARDS (HADIR, IZIN, SAKIT, ALPHA) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Hadir */}
            <div className="bg-[#D0F4DE] p-4 rounded-2xl shadow-sm">
              <div className="text-xs font-bold text-slate-800">Hadir</div>
              <div className="text-2xl font-extrabold text-black mt-3">
                {countStatus("Hadir")}
              </div>
            </div>

            {/* Izin */}
            <div className="bg-[#FEF9C3] p-4 rounded-2xl shadow-sm">
              <div className="text-xs font-bold text-slate-800">Izin</div>
              <div className="text-2xl font-extrabold text-black mt-3">
                {countStatus("Izin")}
              </div>
            </div>

            {/* Sakit */}
            <div className="bg-[#CFFAFE] p-4 rounded-2xl shadow-sm">
              <div className="text-xs font-bold text-slate-800">Sakit</div>
              <div className="text-2xl font-extrabold text-black mt-3">
                {countStatus("Sakit")}
              </div>
            </div>

            {/* Alpha */}
            <div className="bg-[#FEE2E2] p-4 rounded-2xl shadow-sm">
              <div className="text-xs font-bold text-slate-800">Alpha</div>
              <div className="text-2xl font-extrabold text-black mt-3">
                {countStatus("Alpha")}
              </div>
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="flex items-center gap-3 py-12 justify-center text-slate-500 dark:text-slate-400 text-sm font-medium">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memuat data presensi dari database...</span>
            </div>
          )}

          {/* TABLE CONTAINER */}
          {!loading && (
            <div className="bg-[#CBE0FE] rounded-2xl overflow-hidden shadow-sm">
              {/* Table Header */}
              <div className="bg-[#182B4E] text-white px-6 py-4 grid grid-cols-12 text-xs font-bold tracking-wider">
                <div className="col-span-4">Mahasiswa</div>
                <div className="col-span-3">NIM</div>
                <div className="col-span-3">Status Kehadiran</div>
                <div className="col-span-2 text-right pr-4">Lihat Detail</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-blue-200/60">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => (
                    <div
                      key={s.id}
                      className="px-6 py-3.5 grid grid-cols-12 items-center text-xs font-semibold text-slate-900"
                    >
                      <div className="col-span-4 font-bold">{s.name}</div>
                      <div className="col-span-3 text-slate-700">{s.nim}</div>
                      
                      {/* Select Status Dropdown */}
                      <div className="col-span-3">
                        <div className="relative inline-block w-28">
                          <select
                            value={s.status}
                            onChange={(e) =>
                              handleStatusChange(
                                s.id,
                                e.target.value as "Hadir" | "Izin" | "Sakit" | "Alpha"
                              )
                            }
                            className="w-full bg-white text-slate-900 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-300 shadow-sm appearance-none pr-7 focus:outline-none cursor-pointer"
                          >
                            <option value="Hadir">Hadir</option>
                            <option value="Izin">Izin</option>
                            <option value="Sakit">Sakit</option>
                            <option value="Alpha">Alpha</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2 top-2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Button Detail */}
                      <div className="col-span-2 text-right pr-2">
                        <button
                          type="button"
                          onClick={() => setSelectedStudent(s)}
                          className="text-blue-700 hover:text-blue-900 font-semibold hover:underline cursor-pointer"
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-600">
                    Tidak ada data mahasiswa ditemukan.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---------------- MODAL DETAIL MAHASISWA ---------------- */}
          {selectedStudent && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-[#EBF3FE] text-slate-900 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative border border-blue-200">
                
                {/* Header Modal */}
                <div className="flex items-start justify-between pb-4 border-b border-blue-200">
                  <div>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Profil Mahasiswa
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                      Detail Mahasiswa
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="p-1.5 rounded-full hover:bg-blue-200/60 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content Modal */}
                <div className="mt-5 space-y-4">
                  {/* Name & NIM Card */}
                  <div className="bg-[#C1DAFE] p-4 rounded-2xl">
                    <h4 className="text-base font-bold text-slate-900">
                      {selectedStudent.name}
                    </h4>
                    <p className="text-xs text-slate-700 mt-0.5 font-medium">
                      {selectedStudent.nim} • {selectedStudent.course}
                    </p>
                  </div>

                  {/* Nilai Akhir & Kehadiran Card */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#C1DAFE] p-4 rounded-2xl">
                      <span className="text-xs font-semibold text-slate-700">
                        Nilai Akhir
                      </span>
                      <p className="text-xl font-bold text-slate-900 mt-1">
                        {selectedStudent.finalScore}
                      </p>
                    </div>
                    <div className="bg-[#C1DAFE] p-4 rounded-2xl">
                      <span className="text-xs font-semibold text-slate-700">
                        Kehadiran
                      </span>
                      <p className="text-xl font-bold text-slate-900 mt-1">
                        {selectedStudent.status}
                      </p>
                    </div>
                  </div>

                  {/* Riwayat Nilai */}
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-slate-900">
                      Riwayat Nilai
                    </h5>
                    <p className="text-xs text-slate-700 font-medium">
                      {selectedStudent.gradeHistory}
                    </p>
                  </div>

                  {/* Catatan & Rekomendasi */}
                  <div className="space-y-1 pt-1">
                    <h5 className="text-xs font-bold text-slate-900">
                      Catatan & Rekomendasi
                    </h5>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {selectedStudent.notes}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}3