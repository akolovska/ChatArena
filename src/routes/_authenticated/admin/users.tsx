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

const ROLES: Role[] = ["USER", "EVALUATOR", "ADMIN"];
const LABEL: Record<Role, string> = {
  USER: "Корисник",
  EVALUATOR: "Евалуатор",
  ADMIN: "Администратор",
};

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersAdminPage,
});

function UsersAdminPage() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["users"], queryFn: listUsers });

  const mutation = useMutation({
    mutationFn: (v: { id: string | number; role: Role }) =>
      updateUserRole(v.id, v.role),
    onSuccess: () => {
      toast.success("Улогата е ажурирана");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Грешка"),
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Управување со корисници
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Доделете улоги на регистрираните корисници.
        </p>
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
                <TableHead>Корисничко име</TableHead>
                <TableHead>Е-пошта</TableHead>
                <TableHead className="w-[200px]">Улога</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.data?.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.username}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={u.role}
                      onValueChange={(v) =>
                        mutation.mutate({ id: u.id, role: v as Role })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {LABEL[r]}
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
                    Нема корисници.
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
