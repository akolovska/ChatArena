import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ClipboardCheck, Pencil } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { listMetrics } from "@/api/evaluations";
import {
  submitModelEvaluation,
  updateModelEvaluation,
  type ModelEvaluation,
  type ModelEvaluationScores,
} from "@/api/models";

interface Props {
  modelId: number;
  modelName: string;
  initial?: ModelEvaluation;
  onSaved?: () => void;
  onCancel?: () => void;
}

export function ModelEvaluationPanel({ modelId, modelName, initial, onSaved, onCancel }: Props) {
  const { auth } = useAuth();
  const { t, lang } = useI18n();
  const queryClient = useQueryClient();
  const isEdit = !!initial;

  const metricsQuery = useQuery({
    queryKey: ["metrics"],
    queryFn: listMetrics,
    staleTime: 5 * 60 * 1000,
  });

  const modelMetrics = (metricsQuery.data ?? []).filter((m) => m.scope === "MODEL");

  const [scores, setScores] = useState<ModelEvaluationScores>(initial?.scores ?? {});
  const [comment, setComment] = useState(initial?.comment ?? "");
  const [evaluatorName] = useState(initial?.evaluatorName ?? auth?.username ?? "");

  useEffect(() => {
    if (modelMetrics.length === 0) return;
    setScores((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const m of modelMetrics) {
        if (!(m.key in next)) {
          next[m.key] = 3;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [metricsQuery.data]);

  const mutation = useMutation({
    mutationFn: () => {
      const payload = { scores, comment, evaluatorName };
      return isEdit
        ? updateModelEvaluation(initial!.id, payload)
        : submitModelEvaluation(modelId, payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? t("eval.updatedToast") : t("eval.savedToast"));
      queryClient.invalidateQueries({ queryKey: ["modelEvaluations", modelId] });
      if (!isEdit) setComment("");
      onSaved?.();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : t("ask.error")),
  });

  return (
    <Card className="p-4 space-y-4 border-primary/20">
      <div className="flex items-center gap-2">
        {isEdit ? (
          <Pencil className="h-4 w-4 text-primary" />
        ) : (
          <ClipboardCheck className="h-4 w-4 text-primary" />
        )}
        <h3 className="font-semibold text-sm">
          {isEdit ? t("eval.editTitle") : t("models.evaluateModel")} —{" "}
          <span className="text-muted-foreground">{modelName}</span>
        </h3>
      </div>

      {metricsQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {modelMetrics.map((m) => {
            const label = lang === "en" ? m.displayNameEn : m.displayNameMk;
            const value = scores[m.key] ?? 3;
            return (
              <div key={m.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">{label}</Label>
                  <span className="text-sm font-semibold tabular-nums">{value} / 5</span>
                </div>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[value]}
                  onValueChange={([v]) => setScores((s) => ({ ...s, [m.key]: v }))}
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="model-eval-comment" className="text-xs font-medium">
          {t("eval.comment")}
        </Label>
        <Textarea
          id="model-eval-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          placeholder={t("eval.commentPh")}
          className="resize-none"
        />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          {t("eval.evaluator")}:{" "}
          <span className="font-medium text-foreground">{evaluatorName}</span>
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button size="sm" variant="outline" onClick={onCancel} disabled={mutation.isPending}>
              {t("eval.cancel")}
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || metricsQuery.isLoading}
          >
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? t("eval.saveEdit") : t("eval.save")}
          </Button>
        </div>
      </div>
    </Card>
  );
}
