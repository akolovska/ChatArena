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

const PROVIDERS = [
  { value: "static-json", label: "Статички JSON" },
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "custom-http", label: "Custom HTTP" },
];

export const Route = createFileRoute("/_authenticated/admin/models")({
  component: ModelsAdminPage,
});

function ModelsAdminPage() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["models", "all"],
    queryFn: () => listModels(),
  });

  const toggle = useMutation({
    mutationFn: (m: { id: string | number; active: boolean }) =>
      updateModel(m.id, { active: m.active }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["models"] });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Грешка"),
  });

  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Управување со модели
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Регистрирајте и активирајте LLM модели за платформата.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Нов модел
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
                <TableHead>Име</TableHead>
                <TableHead>Провајдер</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-[100px]">Активен</TableHead>
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
                      <Badge>Активен</Badge>
                    ) : (
                      <Badge variant="secondary">Неактивен</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={m.active}
                      onCheckedChange={(v) =>
                        toggle.mutate({ id: m.id, active: v })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
              {query.data?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-8"
                  >
                    Нема регистрирани модели.
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
  const qc = useQueryClient();
  const [displayName, setDisplayName] = useState("");
  const [providerType, setProviderType] = useState("static-json");
  const [configText, setConfigText] = useState("{}");

  const mutation = useMutation({
    mutationFn: () => {
      let config: Record<string, unknown> = {};
      try {
        config = JSON.parse(configText);
      } catch {
        throw new Error("Невалиден JSON во конфигурацијата");
      }
      return createModel({ displayName, providerType, config });
    },
    onSuccess: () => {
      toast.success("Моделот е креиран");
      qc.invalidateQueries({ queryKey: ["models"] });
      setDisplayName("");
      setConfigText("{}");
      onDone();
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Грешка"),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Регистрирај нов модел</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Име за приказ</Label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Провајдер</Label>
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
          <Label>Конфигурација (JSON)</Label>
          <Textarea
            value={configText}
            onChange={(e) => setConfigText(e.target.value)}
            rows={8}
            className="font-mono text-xs"
          />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Зачувај
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
