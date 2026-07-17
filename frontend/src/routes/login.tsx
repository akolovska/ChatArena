import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { setStoredAuth, type Role } from "@/lib/auth-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success("Добредојдовте!");
      navigate({ to: "/ask" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Неуспешна најава";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function devLogin(role: Role) {
    setStoredAuth({
      token: `dev-token-${role.toLowerCase()}`,
      role,
      username: `dev_${role.toLowerCase()}`,
    });
    toast.success(`Дев најава како ${role}`);
    navigate({ to: "/ask" });
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/15 font-semibold">
            MK
          </div>
          <div className="text-lg font-semibold">MK LLM Arena</div>
        </div>
        <div className="space-y-4 max-w-md">
          <h1 className="text-4xl font-semibold leading-tight">
            Евалуација на јазични модели на македонски
          </h1>
          <p className="text-primary-foreground/80">
            Тестирајте, споредувајте и рангирајте одговори од LLM модели.
            Транспарентен процес за истражувачи и евалуатори.
          </p>
        </div>
        <div className="text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} MK LLM Arena
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Најави се
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Внесете ги вашите податоци за пристап
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Корисничко име</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Лозинка</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Најави се
            </Button>
          </form>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">Дев пристап (без backend)</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => devLogin("USER")}>
                USER
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => devLogin("EVALUATOR")}>
                EVALUATOR
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => devLogin("ADMIN")}>
                ADMIN
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Немате сметка?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Регистрирајте се
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

