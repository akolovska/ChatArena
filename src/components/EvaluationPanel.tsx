import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2, ClipboardCheck, Pencil } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import {
  submitEvaluation,
  updateEvaluation,
  type Evaluation,
  type EvaluationScores,
} from "@/api/evaluations";

interface Props {
  questionId: string | number;
  modelId: string | number;
  modelName: string;
  /** Provide to render in edit mode (PUT instead of POST). */
  initial?: Evaluation;
  onSaved?: () => void;
  onCancel?: () => void;
}

const CRITERIA: { key: keyof EvaluationScores; labelKey: string }[] = [
  { key: "fluency", labelKey: "eval.fluency" },
  { key: "accuracy", labelKey: "eval.accuracy" },
  { key: "relevance", labelKey: "eval.relevance" },
  { key: "grammar", labelKey: "eval.grammar" },
];

export function EvaluationPanel({
  questionId,
  modelId,
  modelName,
  initial,
  onSaved,
  onCancel,
}: Props) {
  const { auth } = useAuth();
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const isEdit = !!initial;

  const [scores, setScores] = useState<EvaluationScores>(
    initial?.scores ?? {
      fluency: 3,
      accuracy: 3,
      relevance: 3,
      grammar: 3,
    },
  );
  const [comment, setComment] = useState(initial?.comment ?? "");
  const [evaluatorName] = useState(
    initial?.evaluatorName ?? auth?.username ?? "",
  );

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        questionId,
        modelId,
        scores,
        comment,
        evaluatorName,
      };
      return isEdit
        ? updateEvaluation(initial!.id, payload)
        : submitEvaluation(payload);
    },
    onSuccess: () => {
      toast.success(
        isEdit ? t("eval.updatedToast") : t("eval.savedToast"),
      );
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      if (!isEdit) setComment("");
      onSaved?.();
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : t("ask.error")),
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
          {isEdit ? t("eval.editTitle") : t("eval.title")} —{" "}
          <span className="text-muted-foreground">{modelName}</span>
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CRITERIA.map((c) => (
          <div key={c.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">{t(c.labelKey)}</Label>
              <span className="text-sm font-semibold tabular-nums">
                {scores[c.key]} / 5
              </span>
            </div>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[scores[c.key]]}
              onValueChange={([v]) =>
                setScores((s) => ({ ...s, [c.key]: v }))
              }
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment" className="text-xs font-medium">
          {t("eval.comment")}
        </Label>
        <Textarea
          id="comment"
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
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={mutation.isPending}
            >
              {t("eval.cancel")}
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEdit ? t("eval.saveEdit") : t("eval.save")}
          </Button>
        </div>
      </div>
    </Card>
  );
}
