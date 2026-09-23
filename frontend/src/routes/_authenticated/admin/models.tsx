import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listModels, updateModel } from "@/api/models";
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
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/admin/models")({
  component: ModelsAdminPage,
});

function ModelsAdminPage() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["models", "all"],
    queryFn: () => listModels(),
  });

  const toggle = useMutation({
    mutationFn: (m: { id: number; active: boolean }) =>
      updateModel(m.id, { active: m.active }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["models"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : t("ask.error")),
  });

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
                <TableHead className="w-[100px]">{t("models.activeCol")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.data?.map((m) => (
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
                  <TableCell>
                    <Switch
                      checked={m.active}
                      onCheckedChange={(v) => toggle.mutate({ id: m.id, active: v })}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {query.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
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