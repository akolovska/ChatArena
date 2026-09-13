import { apiFetch } from "./client";
import type { Role } from "@/lib/auth-storage";

export interface LoginResponse {
  token: string;
  role: Role;
}

export function login(username: string, password: string) {
  return apiFetch<LoginResponse>("/user/login", {
    method: "POST",
    body: { username, password },
    auth: false,
  });
}

export interface RegisterInput {
  name: string;
  surname: string;
  email: string;
  username: string;
  password: string;
}

export function register(input: RegisterInput) {
  return apiFetch<void>("/user/register", {
    method: "POST",
    body: input,
    auth: false,
  });
}

export interface UserProfile {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  role: Role;
}

export function getMe() {
  return apiFetch<UserProfile>("/user/me");
}

export function updateMe(patch: {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  return apiFetch<UserProfile>("/user/me", {
    method: "PUT",
    body: patch,
  });
}
