import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/not-permitted")({
  component: NotPermittedPage,
});

function NotPermittedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Немате дозвола</h1>
        <p className="text-muted-foreground">
          Немате доволно привилегии за пристап до оваа страница. Контактирајте администратор доколку
          сметате дека ова е грешка.
        </p>
        <Button asChild>
          <Link to="/ask">Врати се на разговорот</Link>
        </Button>
      </div>
    </div>
  );
}
