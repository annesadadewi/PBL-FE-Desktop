"use client";

import React, { useActionState, useOptimistic, useRef } from "react";
import { createEvaluationAction, ActionState } from "@/app/actions/evalAction";
import { EvalFormInput } from "@/lib/schemas";

type EvalItem = EvalFormInput & { id: string };

const initialState: ActionState = {
  errors: {},
  message: "",
};

export default function EvaluasiCRUDPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [items, setItems] = React.useState<EvalItem[]>([
    {
      id: "1",
      studentName: "Rian Ardianto",
      nim: "2351407001",
      score: 85,
      notes: "Kehadiran baik, tingkatkan partisipasi diskusi.",
    },
  ]);

  // 1. Handling Server Action & State Error Per Field
  const [state, formAction, isPending] = useActionState(
    async (prevState: ActionState, formData: FormData) => {
      // 2. Update Optimistik: Tambah ke UI seketika sebelum respon server selesai
      const optimisticData: EvalItem = {
        id: "temp-" + Date.now(),
        studentName: formData.get("studentName") as string,
        nim: formData.get("nim") as string,
        score: Number(formData.get("score")),
        notes: formData.get("notes") as string,
      };

      addOptimisticItem(optimisticData);

      const result = await createEvaluationAction(prevState, formData);

      if (result.data) {
        setItems((prev) => [...prev, result.data]);
        formRef.current?.reset();
      }

      return result;
    },
    initialState
  );

  // 3. Setup Optimistic UI State
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (currentItems, newItem: EvalItem) => [...currentItems, newItem]
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Form Evaluasi Mahasiswa (CRUD)
        </h1>
        <p className="text-sm text-slate-500">
          Modul Input Evaluasi Belajar Khusus Dosen
        </p>
      </div>

      {/* Form Input */}
      <form ref={formRef} action={formAction} className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded-xl border shadow-sm">
        {state.message && (
          <div className={`p-3 rounded-lg text-sm font-medium ${state.errors && Object.keys(state.errors).length > 0 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
            {state.message}
          </div>
        )}

        {/* Input Nama Mahasiswa */}
        <div>
          <label className="block text-sm font-semibold mb-1">Nama Mahasiswa</label>
          <input
            name="studentName"
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: Budi Santoso"
          />
          {state.errors?.studentName && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              {state.errors.studentName[0]}
            </p>
          )}
        </div>

        {/* Input NIM */}
        <div>
          <label className="block text-sm font-semibold mb-1">NIM</label>
          <input
            name="nim"
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: 2351407001"
          />
          {state.errors?.nim && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              {state.errors.nim[0]}
            </p>
          )}
        </div>

        {/* Input Nilai */}
        <div>
          <label className="block text-sm font-semibold mb-1">Nilai (0 - 100)</label>
          <input
            name="score"
            type="number"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="85"
          />
          {state.errors?.score && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              {state.errors.score[0]}
            </p>
          )}
        </div>

        {/* Input Catatan Evaluasi */}
        <div>
          <label className="block text-sm font-semibold mb-1">Catatan Evaluasi</label>
          <textarea
            name="notes"
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan rekomendasi/catatan..."
          />
          {state.errors?.notes && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              {state.errors.notes[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
        >
          {isPending ? "Menyimpan Data..." : "Tambah Evaluasi"}
        </button>
      </form>

      {/* Daftar Evaluasi Mahasiswa (Optimistic Render) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Daftar Hasil Evaluasi</h2>
        <div className="grid gap-3">
          {optimisticItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded-xl bg-white dark:bg-slate-800 flex justify-between items-center transition-all ${item.id.startsWith("temp-") ? "opacity-60 border-blue-400" : ""}`}
            >
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {item.studentName}{" "}
                  <span className="text-xs text-slate-500">({item.nim})</span>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {item.notes}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-600">
                  {item.score}
                </span>
                {item.id.startsWith("temp-") && (
                  <p className="text-[10px] text-blue-500 italic">Synchronizing...</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}