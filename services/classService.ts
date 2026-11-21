import { apiFetch } from "@/lib/api";
import { ClassItem, CreateClassPayload } from "@/types/class";

export const getClasses = async (): Promise<ClassItem[]> => {
  const data = await apiFetch<any>("/classes", { method: "GET" });
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
};

export const createClass = async (classData: CreateClassPayload): Promise<ClassItem> => {
  const data = await apiFetch<any>("/classes", {
    method: "POST",
    body: JSON.stringify(classData),
  });
  return data?.data || data;
};

export const deleteClass = async (id: string | number): Promise<unknown> => {
  return apiFetch(`/classes/${id}`, {
    method: "DELETE",
  });
};

export const classService = {
  getClasses,
  createClass,
  deleteClass,
};
