import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  MessageSquare,
  ListChecks,
  Cpu,
  Users,
  UserCircle,
  LogOut,
  Menu,
  Languages,
} from "lucide-react";
import { useState } from "react";
import { hasAccess, useAuth } from "@/lib/auth-context";
import type { Role } from "@/lib/auth-storage";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface NavItem {
  key: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const NAV: NavItem[] = [
  { key: "nav.home", url: "/home", icon: Home, roles: ["USER", "EVALUATOR", "ADMIN"] },
  { key: "nav.ask", url: "/ask", icon: MessageSquare, roles: ["USER", "EVALUATOR", "ADMIN"] },
  { key: "nav.questions", url: "/questions", icon: ListChecks, roles: ["USER", "EVALUATOR", "ADMIN"] },
  { key: "nav.models", url: "/admin/models", icon: Cpu, roles: ["ADMIN"] },
  { key: "nav.users", url: "/admin/users", icon: Users, roles: ["ADMIN"] },
];

export function AppTopNav() {
  const { auth, role, logout } = useAuth();
  const { t, lang, setLang } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = NAV.filter((i) => hasAccess(role, i.roles));

  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(url + "/");

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
        <Link to="/home" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
            MK
          </div>
          <span className="hidden sm:block text-sm font-semibold tracking-tight">
            MK LLM Arena
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {items.map((item) => (
            <Link
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive(item.url)
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{t(item.key)}</span>
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5" aria-label={t("lang.switch")}>
                <Languages className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase">{lang}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>{t("lang.switch")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLang("mk")}>
                <span className={cn(lang === "mk" && "font-semibold")}>
                  Македонски
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("en")}>
                <span className={cn(lang === "en" && "font-semibold")}>
                  English
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <UserCircle className="h-5 w-5" />
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-sm font-medium">
                    {auth?.username ?? "—"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {role ? t(`role.${role}`) : ""}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{t("nav.account")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  {t("nav.profile")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                {t("nav.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={t("nav.menu")}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t bg-background px-4 py-2 flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.url}
              to={item.url}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                isActive(item.url)
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{t(item.key)}</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
