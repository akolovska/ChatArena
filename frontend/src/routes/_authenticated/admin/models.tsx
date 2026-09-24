import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { listModels, updateModel, listModelEvaluations } from "@/api/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useAuth, hasAccess } from "@/lib/auth-context";
import { ModelEvaluationPanel } from "@/components/ModelEvaluationPanel";
import { Star, Pencil, User as UserIcon } from "lucide-react";
import { listMetrics, type MetricDefinition } from "@/api/evaluations";
import type { ModelEvaluation } from "@/api/models";

export const Route = createFileRoute("/_authenticated/admin/models")({
  component: ModelsAdminPage,
});

function ModelsAdminPage() {
  const { t } = useI18n();
  const { role } = useAuth();
  const isAdmin = role === "ROLE_ADMIN";
  const canEvaluate = hasAccess(role, ["ROLE_EVALUATOR", "ROLE_ADMIN"]);
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["models", "all"],
    queryFn: () => listModels(),
  });

  const toggle = useMutation({
    mutationFn: (m: { id: number; active: boolean }) => updateModel(m.id, { active: m.active }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["models"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : t("ask.error")),
  });

  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("models.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("models.subtitle")}</p>
      </div>

      <Card>
        {query.isLoading ? (
          <div className="p-6 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("models.name")}</TableHead>
                <TableHead>{t("models.provider")}</TableHead>
                <TableHead>{t("models.status")}</TableHead>
                {isAdmin && <TableHead className="w-[100px]">{t("models.activeCol")}</TableHead>}
                {canEvaluate && <TableHead className="w-[140px]" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.data?.map((m) => (
                <>
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.displayName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{m.providerType ?? "—"}</Badge>
                    </TableCell>
                    <TableCell>
                      {m.active ? (
                        <Badge>{t("models.active")}</Badge>
                      ) : (
                        <Badge variant="secondary">{t("models.inactive")}</Badge>
                      )}
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <Switch
                          checked={m.active}
                          onCheckedChange={(v) => toggle.mutate({ id: m.id, active: v })}
                        />
                      </TableCell>
                    )}
                    {canEvaluate && (
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                        >
                          <ClipboardList className="mr-2 h-3.5 w-3.5" />
                          {t("models.evaluate")}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                  {expandedId === m.id && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-muted/20">
                        <ModelEvaluationSection modelId={m.id} modelName={m.displayName} t={t} />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
              {query.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    {t("models.empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

function ModelEvaluationSection({
  modelId,
  modelName,
  t,
}: {
  modelId: number;
  modelName: string;
  t: (k: string) => string;
}) {
  const { lang } = useI18n();
  const [addingNew, setAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const evalsQuery = useQuery({
    queryKey: ["modelEvaluations", modelId],
    queryFn: () => listModelEvaluations(modelId),
  });

  const metricsQuery = useQuery({
    queryKey: ["metrics"],
    queryFn: listMetrics,
    staleTime: 5 * 60 * 1000,
  });
  const modelMetrics = (metricsQuery.data ?? []).filter((m) => m.scope === "MODEL");

  return (
    <div className="py-3 space-y-3">
      {!addingNew ? (
        <Button size="sm" variant="outline" onClick={() => setAddingNew(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("models.addEvaluation")}
        </Button>
      ) : (
        <ModelEvaluationPanel
          modelId={modelId}
          modelName={modelName}
          onSaved={() => setAddingNew(false)}
          onCancel={() => setAddingNew(false)}
        />
      )}

      <div className="space-y-2">
        {evalsQuery.isLoading && <Skeleton className="h-24 w-full" />}

        {!evalsQuery.isLoading && evalsQuery.data?.length === 0 && !addingNew && (
          <p className="text-xs text-muted-foreground">{t("models.noEvaluations")}</p>
        )}

        {evalsQuery.data?.map((ev) =>
          editingId === ev.id ? (
            <ModelEvaluationPanel
              key={ev.id}
              modelId={modelId}
              modelName={modelName}
              initial={ev}
              onSaved={() => setEditingId(null)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <ModelEvaluationCard
              key={ev.id}
              evaluation={ev}
              metrics={modelMetrics}
              lang={lang}
              onEdit={() => setEditingId(ev.id)}
              t={t}
            />
          ),
        )}
      </div>
    </div>
  );
}

function ModelEvaluationCard({
  evaluation: ev,
  metrics,
  lang,
  onEdit,
  t,
}: {
  evaluation: ModelEvaluation;
  metrics: MetricDefinition[];
  lang: string;
  onEdit: () => void;
  t: (k: string) => string;
}) {
  const locale = lang === "en" ? "en-US" : "mk-MK";
  return (
    <Card
      className="p-3 space-y-2 cursor-pointer hover:border-primary/40 transition-colors"
      onClick={onEdit}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
          <UserIcon className="h-3 w-3" />
          <span className="font-medium text-foreground">{ev.evaluatorName}</span>
        </span>
        <div className="flex items-center gap-3">
          {ev.createdAt && (
            <span className="text-xs text-muted-foreground">
              {new Date(ev.createdAt).toLocaleString(locale)}
            </span>
          )}
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
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {Object.entries(ev.scores).map(([key, value]) => {
          const def = metrics.find((m) => m.key === key);
          const label = def ? (lang === "en" ? def.displayNameEn : def.displayNameMk) : key;
          return (
            <div key={key} className="rounded-lg border p-2">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                <span className="text-sm font-semibold tabular-nums">{value} / 5</span>
              </div>
            </div>
          );
        })}
      </div>
      {ev.comment && (
        <p className="text-sm text-muted-foreground border-l-2 border-primary/40 pl-3">
          {ev.comment}
        </p>
      )}
    </Card>
  );
}
