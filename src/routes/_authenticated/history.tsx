import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { listQuestions } from "@/api/questions";
import { listEvaluations } from "@/api/evaluations";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const questionsQuery = useQuery({
    queryKey: ["questions", "all"],
    queryFn: () => listQuestions(),
  });
  const [questionId, setQuestionId] = useState<string | undefined>();

  const evalQuery = useQuery({
    queryKey: ["evaluations", questionId],
    queryFn: () =>
      listEvaluations({ questionId: questionId ?? undefined }),
    enabled: !!questionId,
  });

  const selectedQuestion = useMemo(
    () => questionsQuery.data?.find((q) => String(q.id) === questionId),
    [questionsQuery.data, questionId],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Историја на евалуации
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Изберете прашање за да ги видите досегашните оценки.
        </p>
      </div>

      <Card className="p-4">
        <Select
          value={questionId}
          onValueChange={setQuestionId}
          disabled={questionsQuery.isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                questionsQuery.isLoading
                  ? "Се вчитуваат прашања..."
                  : "Изберете прашање"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {questionsQuery.data?.map((q) => (
              <SelectItem key={q.id} value={String(q.id)}>
                {q.text.slice(0, 80)}
                {q.text.length > 80 ? "..." : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {selectedQuestion && (
        <Card className="p-4 bg-muted/40">
          <p className="text-sm">{selectedQuestion.text}</p>
        </Card>
      )}

      <div className="space-y-3">
        {evalQuery.isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        {!evalQuery.isLoading && questionId && evalQuery.data?.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground">
            Нема евалуации за ова прашање.
          </Card>
        )}
        {evalQuery.data?.map((ev) => (
          <Card key={ev.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Badge>{ev.modelDisplayName ?? `Модел #${ev.modelId}`}</Badge>
                <span className="text-sm text-muted-foreground">
                  од <span className="font-medium text-foreground">
                    {ev.evaluatorName}
                  </span>
                </span>
              </div>
              {ev.createdAt && (
                <span className="text-xs text-muted-foreground">
                  {new Date(ev.createdAt).toLocaleString("mk-MK")}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <ScoreCell label="Течност" value={ev.scores.fluency} />
              <ScoreCell label="Точност" value={ev.scores.accuracy} />
              <ScoreCell label="Релевантност" value={ev.scores.relevance} />
              <ScoreCell label="Граматика" value={ev.scores.grammar} />
            </div>
            {ev.comment && (
              <p className="text-sm text-muted-foreground border-l-2 border-primary/40 pl-3">
                {ev.comment}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function ScoreCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="flex items-center gap-1 mt-1">
        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
        <span className="text-sm font-semibold tabular-nums">
          {value} / 5
        </span>
      </div>
    </div>
  );
}
