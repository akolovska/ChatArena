import { Link, useRouterState } from "@tanstack/react-router";
import {
  MessageSquare,
  ListChecks,
  History,
  Cpu,
  Users,
  UserCircle,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { hasAccess, useAuth } from "@/lib/auth-context";
import type { Role } from "@/lib/auth-storage";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const NAV: NavItem[] = [
  { title: "Разговор", url: "/ask", icon: MessageSquare, roles: ["USER", "EVALUATOR", "ADMIN"] },
  { title: "Прашања", url: "/questions", icon: ListChecks, roles: ["USER", "EVALUATOR", "ADMIN"] },
  { title: "Историја", url: "/history", icon: History, roles: ["EVALUATOR", "ADMIN"] },
  { title: "Модели", url: "/admin/models", icon: Cpu, roles: ["ADMIN"] },
  { title: "Корисници", url: "/admin/users", icon: Users, roles: ["ADMIN"] },
];

const ROLE_LABEL: Record<Role, string> = {
  USER: "Корисник",
  EVALUATOR: "Евалуатор",
  ADMIN: "Администратор",
};

export function AppSidebar() {
  const { auth, role, logout } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items = NAV.filter((i) => hasAccess(role, i.roles));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <Link to="/ask" className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
            MK
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight">
              MK LLM Arena
            </span>
            <span className="text-xs text-muted-foreground">
              Македонска евалуација
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Навигација</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active =
                  pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                    >
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Профил">
              <Link to="/profile" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium">
                    {auth?.username ?? "—"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {role ? ROLE_LABEL[role] : ""}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="justify-start gap-2 group-data-[collapsible=icon]:justify-center"
        >
          <LogOut className="h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden">
            Одјави се
          </span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
