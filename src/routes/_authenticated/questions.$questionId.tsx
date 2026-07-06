import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Play, Star, Pencil, User as UserIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { listQuestions } from "@/api/questions";
import { listEvaluations, type Evaluation } from "@/api/evaluations";
import { EvaluationPanel } from "@/components/EvaluationPanel";
import { useAuth, hasAccess } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/questions/$questionId")({
  component: QuestionDetailPage,
});

function QuestionDetailPage() {
  const { questionId } = Route.useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const { t, lang } = useI18n();
  const canEdit = hasAccess(role, ["EVALUATOR", "ADMIN"]);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const questionsQuery = useQuery({
    queryKey: ["questions", "all"],
    queryFn: () => listQuestions(),
  });
  const question = questionsQuery.data?.find(
    (q) => String(q.id) === String(questionId),
  );

  const evalQuery = useQuery({
    queryKey: ["evaluations", questionId],
    queryFn: () => listEvaluations({ questionId }),
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: "/questions" })}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("detail.back")}
      </Button>

      <Card className="p-6 space-y-4">
        {questionsQuery.isLoading ? (
          <Skeleton className="h-16 w-full" />
        ) : question ? (
          <>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex flex-wrap gap-2">
                {question.category && (
                  <Badge variant="secondary">{question.category}</Badge>
                )}
                {question.difficulty && (
                  <Badge variant="outline">{question.difficulty}</Badge>
                )}
              </div>
              <Button
                size="sm"
                onClick={() =>
                  navigate({
                    to: "/ask",
                    search: { questionId: String(question.id) },
                  })
                }
              >
                <Play className="mr-2 h-4 w-4" />
                {t("detail.test")}
              </Button>
            </div>
            <p className="text-base leading-relaxed">{question.text}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("detail.notFound")}
          </p>
        )}
      </Card>

      <div>
        <h2 className="text-lg font-semibold tracking-tight mb-3">
          {t("detail.evaluations")} ({evalQuery.data?.length ?? 0})
        </h2>

        <div className="space-y-3">
          {evalQuery.isLoading &&
            Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}

          {!evalQuery.isLoading && evalQuery.data?.length === 0 && (
            <Card className="p-8 text-center text-muted-foreground text-sm">
              {t("detail.empty")}
            </Card>
          )}

          {evalQuery.data?.map((ev) =>
            editingId === ev.id ? (
              <EvaluationPanel
                key={ev.id}
                questionId={ev.questionId}
                modelId={ev.modelId}
                modelName={ev.modelDisplayName ?? `Модел #${ev.modelId}`}
                initial={ev}
                onSaved={() => setEditingId(null)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <EvaluationCard
                key={ev.id}
                evaluation={ev}
                canEdit={canEdit}
                onEdit={() => setEditingId(ev.id)}
                locale={lang === "en" ? "en-US" : "mk-MK"}
                t={t}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function EvaluationCard({
  evaluation: ev,
  canEdit,
  onEdit,
  locale,
  t,
}: {
  evaluation: Evaluation;
  canEdit: boolean;
  onEdit: () => void;
  locale: string;
  t: (k: string) => string;
}) {
  return (
    <Card
      className={
        "p-4 space-y-3 " +
        (canEdit ? "cursor-pointer hover:border-primary/40 transition-colors" : "")
      }
      onClick={canEdit ? onEdit : undefined}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge>{ev.modelDisplayName ?? `#${ev.modelId}`}</Badge>
          <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
            <UserIcon className="h-3 w-3" />
            <span className="font-medium text-foreground">
              {ev.evaluatorName}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {ev.createdAt && (
            <span className="text-xs text-muted-foreground">
              {new Date(ev.createdAt).toLocaleString(locale)}
            </span>
          )}
          {canEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Pencil className="mr-2 h-3.5 w-3.5" />
              {t("detail.edit")}
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <ScoreCell label={t("eval.fluency")} value={ev.scores.fluency} />
        <ScoreCell label={t("eval.accuracy")} value={ev.scores.accuracy} />
        <ScoreCell label={t("eval.relevance")} value={ev.scores.relevance} />
        <ScoreCell label={t("eval.grammar")} value={ev.scores.grammar} />
      </div>
      {ev.comment && (
        <p className="text-sm text-muted-foreground border-l-2 border-primary/40 pl-3">
          {ev.comment}
        </p>
      )}
    </Card>
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
