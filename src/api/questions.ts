import { apiFetch } from "./client";

export interface Question {
  id: string | number;
  text: string;
  category?: string;
  difficulty?: string;
}

export function listQuestions(params?: {
  category?: string;
  difficulty?: string;
}) {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.difficulty) search.set("difficulty", params.difficulty);
  const qs = search.toString();
  return apiFetch<Question[]>(`/questions${qs ? `?${qs}` : ""}`);
}

export function getRandomQuestion() {
  return apiFetch<Question>("/questions/random");
}
