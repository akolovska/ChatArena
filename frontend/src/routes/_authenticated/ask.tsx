import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send, Shuffle, Loader2, Sparkles, User as UserIcon, Columns2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth, hasAccess } from "@/lib/auth-context";
import { listModels, type LlmModel } from "@/api/models";
import { listQuestions, getRandomQuestion } from "@/api/questions";
import { ask, type AskResponse } from "@/api/ask";
import { EvaluationPanel } from "@/components/EvaluationPanel";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface AskSearch {
  questionId?: string;
}

export const Route = createFileRoute("/_authenticated/ask")({
  validateSearch: (s: Record<string, unknown>): AskSearch => ({
    questionId: typeof s.questionId === "string" ? s.questionId : undefined,
  }),
  component: AskPage,
});

interface AnswerCell {
  loading: boolean;
  response?: AskResponse;
  error?: string;
  questionId?: number;
  questionText?: string;
}

function AskPage() {
  const { role } = useAuth();
  const { t } = useI18n();
  const search = useSearch({ from: "/_authenticated/ask" });
  const navigate = useNavigate();

  const modelsQuery = useQuery({
    queryKey: ["models", "active"],
    queryFn: () => listModels({ activeOnly: true }),
  });

  const [compareMode, setCompareMode] = useState(false);

  const [selectedModelIds, setSelectedModelIds] = useState<(number | undefined)[]>([
    undefined,
    undefined,
  ]);

  const [questionText, setQuestionText] = useState("");
  const [questionId, setQuestionId] = useState<number | undefined>(undefined);

  const [cells, setCells] = useState<AnswerCell[]>([{ loading: false }, { loading: false }]);

  const hydratedFromSearch = useRef(false);
  useEffect(() => {
    if (hydratedFromSearch.current) return;
    if (!search.questionId) return;
    hydratedFromSearch.current = true;
    (async () => {
      try {
        const list = await listQuestions();
        const q = list.find((x) => String(x.id) === String(search.questionId));
        if (q) {
          setQuestionId(q.id);
          setQuestionText(q.text);
        }
      } catch {
        /* silent */
      }
    })();
  }, [search.questionId]);

  useEffect(() => {
    if (modelsQuery.data && modelsQuery.data.length > 0 && !selectedModelIds[0]) {
      setSelectedModelIds([modelsQuery.data[0].id, selectedModelIds[1]]);
    }
  }, [modelsQuery.data, selectedModelIds]);

  const activeModels = modelsQuery.data ?? [];

  async function loadRandom() {
    try {
      const q = await getRandomQuestion();
      setQuestionId(q.id);
      setQuestionText(q.text);
      navigate({
        to: "/ask",
        search: { questionId: String(q.id) },
        replace: true,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("ask.error"));
    }
  }

  async function submit() {
    if (!questionText.trim()) {
      toast.error(t("ask.needQuestion"));
      return;
    }
    if (!questionId) {
      toast.error(t("ask.pickQuestion"));
      return;
    }
    const targets = compareMode
      ? [selectedModelIds[0], selectedModelIds[1]]
      : [selectedModelIds[0]];

    if (targets.some((m) => !m)) {
      toast.error(t("ask.pickModel"));
      return;
    }

    setCells((prev) =>
      prev.map((c, i) =>
        i < targets.length ? { loading: true, questionId, questionText } : { loading: false },
      ),
    );

    await Promise.all(
      targets.map(async (modelId, i) => {
        try {
          const res = await ask(questionId!, modelId!);
          setCells((prev) => {
            const next = [...prev];
            next[i] = {
              loading: false,
              response: res,
              questionId,
              questionText,
            };
            return next;
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : t("ask.error");
          setCells((prev) => {
            const next = [...prev];
            next[i] = { loading: false, error: msg, questionId, questionText };
            return next;
          });
        }
      }),
    );
  }

  const canEvaluate = hasAccess(role, ["ROLE_EVALUATOR", "ROLE_ADMIN"]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("ask.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("ask.subtitle")}</p>
        </div>
        <Button
          variant={compareMode ? "default" : "outline"}
          size="sm"
          onClick={() => setCompareMode((v) => !v)}
        >
          <Columns2 className="mr-2 h-4 w-4" />
          {compareMode ? t("ask.compareOff") : t("ask.compareDesc")}
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className={cn("grid gap-4", compareMode ? "md:grid-cols-2" : "md:grid-cols-1")}>
          {(compareMode ? [0, 1] : [0]).map((i) => (
            <ModelPicker
              key={i}
              label={compareMode ? `${t("ask.modelN")} ${i + 1}` : t("ask.model")}
              models={activeModels}
              loading={modelsQuery.isLoading}
              value={selectedModelIds[i]}
              onChange={(v) =>
                setSelectedModelIds((prev) => {
                  const next = [...prev];
                  next[i] = v;
                  return next;
                })
              }
            />
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t("ask.question")}</label>
            <Button variant="ghost" size="sm" onClick={loadRandom}>
              <Shuffle className="mr-2 h-4 w-4" />
              {t("ask.random")}
            </Button>
          </div>
          <Textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder={t("ask.questionPh")}
            rows={3}
            className="resize-none"
          />
          {!questionId && questionText && (
            <p className="text-xs text-muted-foreground">{t("ask.pickQuestion")}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={submit} disabled={cells.some((c) => c.loading)}>
            {cells.some((c) => c.loading) ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {t("ask.send")}
          </Button>
        </div>
      </Card>

      {(cells[0].loading || cells[0].response || cells[0].error) && (
        <div className={cn("grid gap-6", compareMode ? "md:grid-cols-2" : "md:grid-cols-1")}>
          {(compareMode ? [0, 1] : [0]).map((i) => (
            <div key={i} className="space-y-4">
              <ChatBubbles cell={cells[i]} />
              {canEvaluate && cells[i].response && cells[i].questionId && (
                <EvaluationPanel
                  questionId={cells[i].questionId!}
                  modelId={cells[i].response!.modelId}
                  modelName={cells[i].response!.displayName}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ModelPicker({
  label,
  models,
  loading,
  value,
  onChange,
}: {
  label: string;
  models: LlmModel[];
  loading: boolean;
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Select
        value={value != null ? String(value) : undefined}
        onValueChange={(v) => onChange(Number(v))}
        disabled={loading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={loading ? t("ask.loadingModels") : t("ask.selectModel")} />
        </SelectTrigger>
        <SelectContent>
          {models.map((m) => (
            <SelectItem key={m.id} value={String(m.id)}>
              {m.displayName}
            </SelectItem>
          ))}
          {models.length === 0 && !loading && (
            <div className="px-2 py-2 text-sm text-muted-foreground">{t("ask.noModels")}</div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

function ChatBubbles({ cell }: { cell: AnswerCell }) {
  const questionText = useMemo(() => cell.questionText ?? "", [cell.questionText]);
  return (
    <div className="space-y-4">
      {questionText && (
        <div className="flex gap-3 justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-user-bubble text-user-bubble-foreground px-4 py-3 text-sm leading-relaxed">
            {questionText}
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <UserIcon className="h-4 w-4" />
          </div>
        </div>
      )}
      <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <Card className="max-w-[80%] p-4 space-y-2 bg-assistant-bubble text-assistant-bubble-foreground">
          {cell.loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : cell.error ? (
            <p className="text-sm text-destructive">{cell.error}</p>
          ) : cell.response ? (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="font-medium">
                  {cell.response.displayName}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {cell.response.answerText}
              </p>
            </>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
