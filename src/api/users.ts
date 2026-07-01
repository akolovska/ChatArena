import { apiFetch } from "./client";
import type { Role } from "@/lib/auth-storage";

export interface AdminUser {
  id: string | number;
  username: string;
  email: string;
  role: Role;
}

export function listUsers() {
  return apiFetch<AdminUser[]>("/users");
}

export function updateUserRole(id: string | number, role: Role) {
  return apiFetch<AdminUser>(`/users/${id}/role`, {
    method: "PUT",
    body: { role },
  });
}
