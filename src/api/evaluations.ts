import { apiFetch } from "./client";

export interface EvaluationScores {
  fluency: number;
  accuracy: number;
  relevance: number;
  grammar: number;
}

export interface Evaluation {
  id: string | number;
  questionId: string | number;
  modelId: string | number;
  modelDisplayName?: string;
  scores: EvaluationScores;
  comment: string;
  evaluatorName: string;
  createdAt?: string;
}

export function submitEvaluation(input: {
  questionId: string | number;
  modelId: string | number;
  scores: EvaluationScores;
  comment: string;
  evaluatorName: string;
}) {
  return apiFetch<Evaluation>("/evaluations", { method: "POST", body: input });
}

export function listEvaluations(params: { questionId?: string | number }) {
  const search = new URLSearchParams();
  if (params.questionId != null)
    search.set("questionId", String(params.questionId));
  const qs = search.toString();
  return apiFetch<Evaluation[]>(`/evaluations${qs ? `?${qs}` : ""}`);
}
