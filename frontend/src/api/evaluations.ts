import { apiFetch } from "./client";

export interface EvaluationScores {
  fluency: number;
  accuracy: number;
  relevance: number;
  grammar: number;
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

export function listEvaluations(params: { questionId?: number }) {
  const search = new URLSearchParams();
  if (params.questionId != null) search.set("questionId", String(params.questionId));
  const qs = search.toString();
  return apiFetch<Evaluation[]>(`/evaluations${qs ? `?${qs}` : ""}`);
}
