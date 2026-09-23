import { apiFetch } from "./client";

export interface LlmModel {
  id: number;
  displayName: string;
  active: boolean;
  providerType?: string;
  config?: Record<string, unknown>;
}

export function listModels(params?: { activeOnly?: boolean }) {
  return apiFetch<LlmModel[]>("/models").then((all) =>
    params?.activeOnly ? all.filter((m) => m.active) : all,
  );
}

export function updateModel(id: number, patch: Partial<Omit<LlmModel, "id">>) {
  return apiFetch<LlmModel>(`/models/${id}`, { method: "PUT", body: patch });
}
