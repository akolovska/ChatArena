import { apiFetch } from "./client";

export interface AskResponse {
  modelId: number;
  displayName: string;
  answerText: string;
}

export function ask(questionId: number, modelId: number) {
  return apiFetch<AskResponse>("/ask", {
    method: "POST",
    body: { questionId, modelId },
  });
}
