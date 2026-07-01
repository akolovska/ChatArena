import { apiFetch } from "./client";
import type { Role } from "@/lib/auth-storage";

export interface LoginResponse {
  token: string;
  role: Role;
}

export function login(username: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: { username, password },
    auth: false,
  });
}

export function register(username: string, email: string, password: string) {
  return apiFetch<void>("/auth/register", {
    method: "POST",
    body: { username, email, password },
    auth: false,
  });
}

export interface UserProfile {
  id: string | number;
  username: string;
  email: string;
  role: Role;
}

export function getMe() {
  return apiFetch<UserProfile>("/auth/me");
}

export function updateMe(patch: {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  return apiFetch<UserProfile>("/auth/me", {
    method: "PUT",
    body: patch,
  });
}
