import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppTopNav } from "@/components/AppTopNav";
import { getStoredAuth } from "@/lib/auth-storage";
import { useAuth, hasAccess } from "@/lib/auth-context";
import type { Role } from "@/lib/auth-storage";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const ROLE_RULES: { prefix: string; roles: Role[] }[] = [
  { prefix: "/admin/models", roles: ["ROLE_EVALUATOR", "ROLE_ADMIN"] },
  { prefix: "/admin/users", roles: ["ROLE_ADMIN"] },
  { prefix: "/history", roles: ["ROLE_EVALUATOR", "ROLE_ADMIN"] },
];

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const auth = getStoredAuth();
    if (!auth) throw redirect({ to: "/login" });
  },
  component: AuthLayout,
});

function AuthLayout() {
  const { isAuthenticated, role } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login", replace: true });
      return;
    }
    const rule = ROLE_RULES.find((r) => pathname.startsWith(r.prefix));
    if (rule && !hasAccess(role, rule.roles)) {
      toast.error("Немате дозвола за пристап до оваа страница");
      navigate({ to: "/not-permitted", replace: true });
    }
  }, [isAuthenticated, role, pathname, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppTopNav />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
