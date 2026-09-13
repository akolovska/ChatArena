import { apiFetch } from "./client";

export type QuestionCategory = "general" | "science" | "history" | "culture";
export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface Question {
  id: number;
  text: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
}

export function listQuestions(params?: {
  category?: QuestionCategory;
  difficulty?: QuestionDifficulty;
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
