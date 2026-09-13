import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listModels, createModel, updateModel } from "@/api/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
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
    mutationFn: (m: { id: number; active: boolean }) => updateModel(m.id, { active: m.active }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["models"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : t("ask.error")),
  });

  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("models.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("models.subtitle")}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("models.new")}
            </Button>
          </DialogTrigger>
          <NewModelDialog onDone={() => setOpen(false)} />
        </Dialog>
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

function NewModelDialog({ onDone }: { onDone: () => void }) {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [displayName, setDisplayName] = useState("");
  const [providerType, setProviderType] = useState("static-json");
  const [configText, setConfigText] = useState("{}");

  const PROVIDERS = [
    { value: "static-json", label: t("models.providerStatic") },
    { value: "openai", label: t("models.providerOpenAI") },
    { value: "anthropic", label: t("models.providerAnthropic") },
    { value: "custom-http", label: t("models.providerCustomHttp") },
  ];

  const mutation = useMutation({
    mutationFn: () => {
      let config: Record<string, unknown> = {};
      try {
        config = JSON.parse(configText);
      } catch {
        throw new Error(t("models.invalidConfig"));
      }
      return createModel({ displayName, providerType, config });
    },
    onSuccess: () => {
      toast.success(t("models.created"));
      qc.invalidateQueries({ queryKey: ["models"] });
      setDisplayName("");
      setConfigText("{}");
      onDone();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : t("ask.error")),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("models.dialogTitle")}</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>{t("models.displayName")}</Label>
          <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>{t("models.provider")}</Label>
          <Select value={providerType} onValueChange={setProviderType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROVIDERS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("models.config")}</Label>
          <Textarea
            value={configText}
            onChange={(e) => setConfigText(e.target.value)}
            rows={8}
            className="font-mono text-xs"
          />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("models.save")}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
