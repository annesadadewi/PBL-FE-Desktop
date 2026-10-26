import { z } from "zod";

// Schema Login Dosen (Validasi NIM / Email dan Password)
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "Email atau NIP/NIM wajib diisi" })
    .refine(
      (val) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        const isNIPorNIM = /^\d{8,18}$/.test(val); // Angka 8 hingga 18 digit
        return isEmail || isNIPorNIM;
      },
      { message: "Format harus berupa Email resmi atau NIP/NIM angka (8-18 digit)" }
    ),
  password: z
    .string()
    .min(8, { message: "Password minimal 8 karakter" })
    .regex(/[A-Z]/, { message: "Password harus mengandung minimal 1 huruf besar" })
    .regex(/[0-9]/, { message: "Password harus mengandung minimal 1 angka" }),
});

// Schema Form Evaluasi Mahasiswa
export const evalFormSchema = z.object({
  studentName: z
    .string()
    .min(3, { message: "Nama mahasiswa minimal 3 karakter" }),
  nim: z
    .string()
    .length(15, { message: "NIM mahasiswa harus tepat 15 digit angka" })
    .regex(/^\d+$/, { message: "NIM harus berupa angka murni" }),
  score: z.coerce
    .number()
    .min(0, { message: "Nilai minimal 0" })
    .max(100, { message: "Nilai maksimal 100" }),
  notes: z
    .string()
    .min(5, { message: "Catatan evaluasi minimal 5 karakter" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type EvalFormInput = z.infer<typeof evalFormSchema>;