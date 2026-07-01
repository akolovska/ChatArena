import { apiFetch } from "./client";

export interface AskResponse {
  modelId: string | number;
  displayName: string;
  answerText: string;
  responseTimeMs: number;
}

export function ask(questionId: string | number, modelId: string | number) {
  return apiFetch<AskResponse>("/ask", {
    method: "POST",
    body: { questionId, modelId },
  });
}
