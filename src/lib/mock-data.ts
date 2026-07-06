// Mock fallback data used when the Spring Boot backend is unreachable.
// Lets the UI be explored end-to-end without a running API.

import type { Question } from "@/api/questions";
import type { Evaluation, EvaluationInput } from "@/api/evaluations";
import type { LlmModel } from "@/api/models";

const models: LlmModel[] = [
  { id: 1, displayName: "GPT-4o", active: true, providerType: "openai" },
  { id: 2, displayName: "Claude 3.5 Sonnet", active: true, providerType: "anthropic" },
  { id: 3, displayName: "Llama 3.1 70B", active: true, providerType: "custom-http" },
  { id: 4, displayName: "Mistral Large", active: false, providerType: "custom-http" },
];

const questions: Question[] = [
  {
    id: 1,
    text: "Кој е главниот град на Република Северна Македонија и колку жители има?",
    category: "Географија",
    difficulty: "Лесно",
  },
  {
    id: 2,
    text: "Објасни ја разликата помеѓу глаголските придавки и глаголските прилози во македонскиот јазик.",
    category: "Граматика",
    difficulty: "Тешко",
  },
  {
    id: 3,
    text: "Кој ја напишал „Бели мугри“ и во која година е објавена збирката?",
    category: "Литература",
    difficulty: "Средно",
  },
  {
    id: 4,
    text: "Кои се традиционалните јадења за Велигден во Македонија?",
    category: "Култура",
    difficulty: "Лесно",
  },
  {
    id: 5,
    text: "Опиши го значењето на Илинденското востание од 1903 година.",
    category: "Историја",
    difficulty: "Средно",
  },
  {
    id: 6,
    text: "Преведи го следниот текст на англиски: „Утрото е попаметно од вечерта.“",
    category: "Превод",
    difficulty: "Лесно",
  },
  {
    id: 7,
    text: "Кои реки поминуваат низ Скопје и во кои реки се влеваат?",
    category: "Географија",
    difficulty: "Средно",
  },
];

let evaluations: Evaluation[] = [
  {
    id: 101,
    questionId: 1,
    modelId: 1,
    modelDisplayName: "GPT-4o",
    scores: { fluency: 5, accuracy: 5, relevance: 5, grammar: 5 },
    comment: "Точен и јасен одговор со дополнителен контекст за населението.",
    evaluatorName: "ana.k",
    createdAt: "2026-06-15T10:30:00Z",
  },
  {
    id: 102,
    questionId: 1,
    modelId: 2,
    modelDisplayName: "Claude 3.5 Sonnet",
    scores: { fluency: 5, accuracy: 4, relevance: 5, grammar: 5 },
    comment: "Одличен јазик, но бројот на жители е малку застарен.",
    evaluatorName: "marko.p",
    createdAt: "2026-06-16T09:12:00Z",
  },
  {
    id: 103,
    questionId: 2,
    modelId: 1,
    modelDisplayName: "GPT-4o",
    scores: { fluency: 4, accuracy: 4, relevance: 5, grammar: 4 },
    comment: "Добро објаснување со примери, но малку долго.",
    evaluatorName: "ana.k",
    createdAt: "2026-06-18T14:00:00Z",
  },
  {
    id: 104,
    questionId: 2,
    modelId: 3,
    modelDisplayName: "Llama 3.1 70B",
    scores: { fluency: 3, accuracy: 2, relevance: 3, grammar: 3 },
    comment: "Меша ги концептите; неколку граматички грешки.",
    evaluatorName: "elena.s",
    createdAt: "2026-06-20T11:45:00Z",
  },
  {
    id: 105,
    questionId: 3,
    modelId: 2,
    modelDisplayName: "Claude 3.5 Sonnet",
    scores: { fluency: 5, accuracy: 5, relevance: 5, grammar: 5 },
    comment: "Совршен одговор со биографски детали за Кочо Рацин.",
    evaluatorName: "marko.p",
    createdAt: "2026-06-22T16:20:00Z",
  },
  {
    id: 106,
    questionId: 5,
    modelId: 1,
    modelDisplayName: "GPT-4o",
    scores: { fluency: 5, accuracy: 5, relevance: 4, grammar: 5 },
    comment: "Историски прецизно и добро структурирано.",
    evaluatorName: "ana.k",
    createdAt: "2026-06-25T08:05:00Z",
  },
];

let nextEvalId = 200;

function ok<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

/** Returns mock data for the given endpoint or null if not mocked. */
export function handleMock(
  method: string,
  path: string,
  body: unknown,
): unknown | null {
  const m = method.toUpperCase();

  // /models
  if (m === "GET" && path === "/models") return ok(models);

  // /questions
  if (m === "GET" && path.startsWith("/questions/random")) {
    const q = questions[Math.floor(Math.random() * questions.length)];
    return ok(q);
  }
  if (m === "GET" && path.startsWith("/questions")) {
    const url = new URL(`http://x${path}`);
    const cat = url.searchParams.get("category");
    const dif = url.searchParams.get("difficulty");
    return ok(
      questions.filter(
        (q) =>
          (!cat || q.category === cat) && (!dif || q.difficulty === dif),
      ),
    );
  }

  // /evaluations
  if (m === "GET" && path.startsWith("/evaluations")) {
    const url = new URL(`http://x${path}`);
    const qid = url.searchParams.get("questionId");
    return ok(
      qid
        ? evaluations.filter((e) => String(e.questionId) === String(qid))
        : evaluations,
    );
  }
  if (m === "POST" && path === "/evaluations") {
    const input = body as EvaluationInput;
    const model = models.find((mm) => String(mm.id) === String(input.modelId));
    const created: Evaluation = {
      id: nextEvalId++,
      ...input,
      modelDisplayName: model?.displayName,
      createdAt: new Date().toISOString(),
    };
    evaluations = [created, ...evaluations];
    return ok(created);
  }
  if (m === "PUT" && path.startsWith("/evaluations/")) {
    const id = path.split("/").pop()!;
    const input = body as EvaluationInput;
    evaluations = evaluations.map((e) =>
      String(e.id) === id ? { ...e, ...input } : e,
    );
    const updated = evaluations.find((e) => String(e.id) === id);
    return updated ? ok(updated) : null;
  }

  // /ask — synthesize a plausible answer
  if (m === "POST" && path === "/ask") {
    const { modelId } = body as { modelId: string | number };
    const model = models.find((mm) => String(mm.id) === String(modelId));
    return ok({
      modelId,
      displayName: model?.displayName ?? `Модел #${modelId}`,
      answerText:
        "Ова е примерен (mock) одговор бидејќи backend серверот не е достапен. " +
        "Кога Spring Boot API-то ќе биде поврзано, тука ќе се појави вистинскиот одговор од моделот.",
      responseTimeMs: 400 + Math.floor(Math.random() * 800),
    });
  }

  return null;
}
