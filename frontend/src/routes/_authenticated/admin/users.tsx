import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listUsers, updateUserRole } from "@/api/users";
import type { Role } from "@/lib/auth-storage";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n";

const ROLES: Role[] = ["ROLE_USER", "ROLE_EVALUATOR", "ROLE_ADMIN"];

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersAdminPage,
});

function UsersAdminPage() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["users"], queryFn: listUsers });

  const mutation = useMutation({
    mutationFn: (v: { id: number; role: Role }) => updateUserRole(v.id, v.role),
    onSuccess: () => {
      toast.success(t("users.roleUpdated"));
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : t("ask.error")),
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("users.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("users.subtitle")}</p>
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
                <TableHead>{t("users.username")}</TableHead>
                <TableHead>{t("users.email")}</TableHead>
                <TableHead className="w-[200px]">{t("users.role")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.data?.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.username}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Select
                      value={u.role}
                      onValueChange={(v) => mutation.mutate({ id: u.id, role: v as Role })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {t(`role.${r}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {query.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    {t("users.empty")}
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
