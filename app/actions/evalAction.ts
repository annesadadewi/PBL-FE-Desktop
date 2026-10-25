"use server";

import { evalFormSchema } from "@/lib/schemas";

export type ActionState = {
  errors?: {
    studentName?: string[];
    nim?: string[];
    score?: string[];
    notes?: string[];
  };
  message?: string;
  data?: any;
};

export async function createEvaluationAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    studentName: formData.get("studentName"),
    nim: formData.get("nim"),
    score: formData.get("score"),
    notes: formData.get("notes"),
  };

  // Validasi safeParse di server
  const validatedFields = evalFormSchema.safeParse(rawData);

  // Jika data tidak valid, kembalikan error per field
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Gagal menyimpan data. Periksa kembali form Anda.",
    };
  }

  // Simulasi simpan data ke database backend
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newItem = {
    id: Date.now().toString(),
    ...validatedFields.data,
  };

  return {
    message: "Data evaluasi mahasiswa berhasil ditambahkan!",
    data: newItem,
  };
}