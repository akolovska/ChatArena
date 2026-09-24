import { apiFetch } from "./client";
import { ModelEvaluation, ModelEvaluationInput } from "@/api/models.ts";

export type EvaluationScores = Record<string, number>;

export interface MetricDefinition {
  key: string;
  displayNameMk: string;
  displayNameEn: string;
  sortOrder: number;
  scope: "RESPONSE" | "MODEL";
}

export interface Evaluation {
  id: number;
  questionId: number;
  modelId: number;
  modelDisplayName?: string;
  scores: EvaluationScores;
  comment: string;
  evaluatorName: string;
  createdAt?: string;
}

export interface EvaluationInput {
  questionId: number;
  modelId: number;
  scores: EvaluationScores;
  comment: string;
  evaluatorName: string;
}

export function listMetrics() {
  return apiFetch<MetricDefinition[]>("/evaluations/metrics");
}

export function submitEvaluation(input: EvaluationInput) {
  return apiFetch<Evaluation>("/evaluations", { method: "POST", body: input });
}

export function updateEvaluation(id: number, input: EvaluationInput) {
  return apiFetch<Evaluation>(`/evaluations/${id}`, {
    method: "PUT",
    body: input,
  });
}

export function getEvaluation(id: number) {
  return apiFetch<Evaluation>(`/evaluations/${id}`);
}
export function updateModelEvaluation(id: number, input: ModelEvaluationInput) {
  return apiFetch<ModelEvaluation>(`/models/evaluations/${id}`, {
    method: "PUT",
    body: input,
  });
}

export function listEvaluations(params: { questionId?: number }) {
  const search = new URLSearchParams();
  if (params.questionId != null) search.set("questionId", String(params.questionId));
  const qs = search.toString();
  return apiFetch<Evaluation[]>(`/evaluations${qs ? `?${qs}` : ""}`);
}
