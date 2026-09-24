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

export type ModelEvaluationScores = Record<string, number>;

export interface ModelEvaluation {
  id: number;
  modelId: number;
  scores: ModelEvaluationScores;
  comment: string;
  evaluatorName: string;
  createdAt?: string;
}

export interface ModelEvaluationInput {
  scores: ModelEvaluationScores;
  comment: string;
  evaluatorName: string;
}

export function listModelEvaluations(modelId: number) {
  return apiFetch<ModelEvaluation[]>(`/models/${modelId}/evaluations`);
}

export function submitModelEvaluation(modelId: number, input: ModelEvaluationInput) {
  return apiFetch<ModelEvaluation>(`/models/${modelId}/evaluations`, {
    method: "POST",
    body: input,
  });
}

export function updateModelEvaluation(id: number, input: ModelEvaluationInput) {
  return apiFetch<ModelEvaluation>(`/models/evaluations/${id}`, {
    method: "PUT",
    body: input,
  });
}
