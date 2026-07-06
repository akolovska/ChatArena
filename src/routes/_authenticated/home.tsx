import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MessageSquare,
  ListChecks,
  Cpu,
  Users,
  UserCircle,
  ArrowRight,
} from "lucide-react";
import { hasAccess, useAuth } from "@/lib/auth-context";
import type { Role } from "@/lib/auth-storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/home")({
  component: HomePage,
});

interface Tile {
  titleKey: string;
  descKey: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const TILES: Tile[] = [
  {
    titleKey: "home.tile.ask.title",
    descKey: "home.tile.ask.desc",
    url: "/ask",
    icon: MessageSquare,
    roles: ["USER", "EVALUATOR", "ADMIN"],
  },
  {
    titleKey: "home.tile.questions.title",
    descKey: "home.tile.questions.desc",
    url: "/questions",
    icon: ListChecks,
    roles: ["USER", "EVALUATOR", "ADMIN"],
  },
  {
    titleKey: "home.tile.models.title",
    descKey: "home.tile.models.desc",
    url: "/admin/models",
    icon: Cpu,
    roles: ["ADMIN"],
  },
  {
    titleKey: "home.tile.users.title",
    descKey: "home.tile.users.desc",
    url: "/admin/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    titleKey: "home.tile.profile.title",
    descKey: "home.tile.profile.desc",
    url: "/profile",
    icon: UserCircle,
    roles: ["USER", "EVALUATOR", "ADMIN"],
  },
];

function HomePage() {
  const { auth, role } = useAuth();
  const { t } = useI18n();
  const tiles = TILES.filter((tile) => hasAccess(role, tile.roles));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-10">
      <section className="space-y-3">
        <div className="inline-flex items-center rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
          {t("home.badge")}
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {t("home.welcome")}{auth?.username ? `, ${auth.username}` : ""}
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          {t("home.intro")}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button asChild>
            <Link to="/ask">
              {t("home.cta.start")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/questions">{t("home.cta.browse")}</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <Link key={tile.url} to={tile.url} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/50 group-hover:bg-muted/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <tile.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{t(tile.titleKey)}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{t(tile.descKey)}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
