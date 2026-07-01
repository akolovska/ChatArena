import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { getStoredAuth } from "@/lib/auth-storage";
import { useAuth, hasAccess } from "@/lib/auth-context";
import type { Role } from "@/lib/auth-storage";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const ROLE_RULES: { prefix: string; roles: Role[] }[] = [
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/history", roles: ["EVALUATOR", "ADMIN"] },
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col min-w-0">
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="ml-2 text-sm font-medium text-muted-foreground">
              MK LLM Arena
            </div>
          </header>
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
