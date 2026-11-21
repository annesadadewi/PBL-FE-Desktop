export type UserRole = "dosen" | "lecturer" | "mahasiswa" | "student" | "admin" | string;

export interface User {
  id?: string | number;
  name?: string;
  email?: string;
  role?: UserRole;
  nip?: string;
  avatar?: string;
  [key: string]: unknown;
}

export interface LoginCredentials {
  identifier?: string;
  email?: string;
  password?: string;
}

export interface LoginResponse {
  token?: string;
  user?: User;
  role?: string;
  message?: string;
  data?: {
    token?: string;
    user?: User;
    [key: string]: unknown;
  };
}
