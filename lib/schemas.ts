import { z } from "zod";

export const evalFormSchema = z.object({
  studentName: z
    .string()
    .min(3, { message: "Nama mahasiswa minimal 3 karakter" }),
  nim: z
    .string()
    .min(8, { message: "NIM minimal 8 digit angka" })
    .regex(/^\d+$/, { message: "NIM harus berupa angka" }),
  score: z.coerce
    .number()
    .min(0, { message: "Nilai minimal 0" })
    .max(100, { message: "Nilai maksimal 100" }),
  notes: z
    .string()
    .min(5, { message: "Catatan evaluasi minimal 5 karakter" }),
});

export type EvalFormInput = z.infer<typeof evalFormSchema>;