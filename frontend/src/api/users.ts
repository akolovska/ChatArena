import { apiFetch } from "./client";
import type { Role } from "@/lib/auth-storage";

export interface AdminUser {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  role: Role;
}

export function listUsers() {
  return apiFetch<AdminUser[]>("/user");
}

export function updateUserRole(id: number, role: Role) {
  return apiFetch<AdminUser>(`/user/${id}/role`, {
    method: "PUT",
    body: { role },
  });
}
