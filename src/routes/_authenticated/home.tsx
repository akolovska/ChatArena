import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MessageSquare,
  ListChecks,
  History,
  Cpu,
  Users,
  UserCircle,
  ArrowRight,
} from "lucide-react";
import { hasAccess, useAuth } from "@/lib/auth-context";
import type { Role } from "@/lib/auth-storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/home")({
  component: HomePage,
});

interface Tile {
  title: string;
  description: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const TILES: Tile[] = [
  {
    title: "Разговор со модел",
    description: "Поставете прашање и добијте одговор од избран LLM модел.",
    url: "/ask",
    icon: MessageSquare,
    roles: ["USER", "EVALUATOR", "ADMIN"],
  },
  {
    title: "Банка на прашања",
    description: "Прегледајте ги достапните прашања за евалуација.",
    url: "/questions",
    icon: ListChecks,
    roles: ["USER", "EVALUATOR", "ADMIN"],
  },
  {
    title: "Историја на евалуации",
    description: "Погледнете претходни оценувања и резултати.",
    url: "/history",
    icon: History,
    roles: ["EVALUATOR", "ADMIN"],
  },
  {
    title: "Управување со модели",
    description: "Додавајте и конфигурирајте LLM модели.",
    url: "/admin/models",
    icon: Cpu,
    roles: ["ADMIN"],
  },
  {
    title: "Управување со корисници",
    description: "Доделувајте улоги и управувајте сметки.",
    url: "/admin/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "Мој профил",
    description: "Ажурирајте лични податоци и лозинка.",
    url: "/profile",
    icon: UserCircle,
    roles: ["USER", "EVALUATOR", "ADMIN"],
  },
];

function HomePage() {
  const { auth, role } = useAuth();
  const tiles = TILES.filter((t) => hasAccess(role, t.roles));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-10">
      <section className="space-y-3">
        <div className="inline-flex items-center rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
          MK LLM Arena
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Добредојдовте{auth?.username ? `, ${auth.username}` : ""}
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Платформа за евалуација на јазични модели на македонски јазик.
          Поставувајте прашања, споредувајте одговори и рангирајте перформанси
          на различни LLM модели.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button asChild>
            <Link to="/ask">
              Започни разговор
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/questions">Прегледај прашања</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.url} to={t.url} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/50 group-hover:bg-muted/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{t.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{t.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
