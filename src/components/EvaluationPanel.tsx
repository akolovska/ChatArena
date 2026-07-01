import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2, ClipboardCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { submitEvaluation, type EvaluationScores } from "@/api/evaluations";

interface Props {
  questionId: string | number;
  modelId: string | number;
  modelName: string;
}

const CRITERIA: { key: keyof EvaluationScores; label: string }[] = [
  { key: "fluency", label: "Течност" },
  { key: "accuracy", label: "Точност" },
  { key: "relevance", label: "Релевантност" },
  { key: "grammar", label: "Граматика" },
];

export function EvaluationPanel({ questionId, modelId, modelName }: Props) {
  const { auth } = useAuth();
  const [scores, setScores] = useState<EvaluationScores>({
    fluency: 3,
    accuracy: 3,
    relevance: 3,
    grammar: 3,
  });
  const [comment, setComment] = useState("");
  const [evaluatorName, setEvaluatorName] = useState(auth?.username ?? "");

  const mutation = useMutation({
    mutationFn: () =>
      submitEvaluation({
        questionId,
        modelId,
        scores,
        comment,
        evaluatorName,
      }),
    onSuccess: () => {
      toast.success("Евалуацијата е зачувана");
      setComment("");
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Грешка"),
  });

  return (
    <Card className="p-4 space-y-4 border-primary/20">
      <div className="flex items-center gap-2">
        <ClipboardCheck className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">
          Евалуација — <span className="text-muted-foreground">{modelName}</span>
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CRITERIA.map((c) => (
          <div key={c.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">{c.label}</Label>
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
          Коментар
        </Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          placeholder="Забелешки за одговорот..."
          className="resize-none"
        />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          Евалуатор: <span className="font-medium text-foreground">{evaluatorName}</span>
        </div>
        <Button
          size="sm"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Зачувај евалуација
        </Button>
      </div>
    </Card>
  );
}
