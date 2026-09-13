import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getMe, updateMe } from "@/api/auth";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { auth, updateAuth } = useAuth();
  const me = useQuery({ queryKey: ["me"], queryFn: getMe });

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (me.data) {
      setUsername(me.data.username);
      setEmail(me.data.email);
    } else if (auth) {
      setUsername(auth.username);
    }
  }, [me.data, auth]);

  const profileMutation = useMutation({
    mutationFn: () => updateMe({ username, email }),
    onSuccess: (u) => {
      toast.success("Профилот е ажуриран");
      updateAuth({ username: u.username });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Грешка"),
  });

  const passwordMutation = useMutation({
    mutationFn: () => updateMe({ currentPassword, newPassword }),
    onSuccess: () => {
      toast.success("Лозинката е променета");
      setCurrentPassword("");
      setNewPassword("");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Грешка"),
  });

  function onSaveProfile(e: FormEvent) {
    e.preventDefault();
    profileMutation.mutate();
  }
  function onChangePassword(e: FormEvent) {
    e.preventDefault();
    passwordMutation.mutate();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Мој профил</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ажурирајте ги вашите податоци и лозинка.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Основни податоци</h2>
        {me.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <form onSubmit={onSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label>Корисничко име</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Е-пошта</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={profileMutation.isPending}>
                {profileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Зачувај
              </Button>
            </div>
          </form>
        )}
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Промена на лозинка</h2>
        <Separator />
        <form onSubmit={onChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label>Тековна лозинка</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-2">
            <Label>Нова лозинка</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={passwordMutation.isPending}>
              {passwordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Промени лозинка
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
