import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Star, User as UserIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { listEvaluations, type Evaluation } from "@/api/evaluations";
import { listQuestions, type Question } from "@/api/questions";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const { t, lang } = useI18n();
  const locale = lang === "en" ? "en-US" : "mk-MK";

  const evalQuery = useQuery({
    queryKey: ["evaluations", "all"],
    queryFn: () => listEvaluations({}),
  });

  const questionsQuery = useQuery({
    queryKey: ["questions", "all"],
    queryFn: () => listQuestions(),
  });

  const questionById = useMemo(() => {
    const map = new Map<number, Question>();
    questionsQuery.data?.forEach((q) => map.set(q.id, q));
    return map;
  }, [questionsQuery.data]);

  const sorted = useMemo(() => {
    const data = evalQuery.data ?? [];
    return [...data].sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta;
    });
  }, [evalQuery.data]);

  const isLoading = evalQuery.isLoading || questionsQuery.isLoading;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("history.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("history.subtitle")}</p>
      </div>

      <div className="space-y-3">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 w-full" />)}

        {!isLoading && sorted.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground text-sm">
            {t("history.empty")}
          </Card>
        )}

        {sorted.map((ev) => (
          <HistoryCard
            key={ev.id}
            evaluation={ev}
            question={questionById.get(ev.questionId)}
            locale={locale}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

function HistoryCard({
  evaluation: ev,
  question,
  locale,
  t,
}: {
  evaluation: Evaluation;
  question?: Question;
  locale: string;
  t: (k: string) => string;
}) {
  return (
    <Link to="/questions/$questionId" params={{ questionId: String(ev.questionId) }}>
      <Card className="p-4 space-y-3 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer">
        <p className="text-sm leading-relaxed line-clamp-2 text-foreground">
          {question?.text ?? `${t("history.question")} #${ev.questionId}`}
        </p>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge>{ev.modelDisplayName ?? `#${ev.modelId}`}</Badge>
            <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
              <UserIcon className="h-3 w-3" />
              <span className="font-medium text-foreground">{ev.evaluatorName}</span>
            </span>
          </div>
          {ev.createdAt && (
            <span className="text-xs text-muted-foreground">
              {new Date(ev.createdAt).toLocaleString(locale)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <ScoreCell label={t("eval.fluency")} value={ev.scores.fluency} />
          <ScoreCell label={t("eval.accuracy")} value={ev.scores.accuracy} />
          <ScoreCell label={t("eval.relevance")} value={ev.scores.relevance} />
          <ScoreCell label={t("eval.grammar")} value={ev.scores.grammar} />
        </div>

        {ev.comment && (
          <p className="text-sm text-muted-foreground border-l-2 border-primary/40 pl-3 line-clamp-2">
            {ev.comment}
          </p>
        )}
      </Card>
    </Link>
  );
}

function ScoreCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="flex items-center gap-1 mt-1">
        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
        <span className="text-sm font-semibold tabular-nums">{value} / 5</span>
      </div>
    </div>
  );
}
