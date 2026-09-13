import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { listQuestions, type QuestionCategory, type QuestionDifficulty } from "@/api/questions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/questions/")({
  component: QuestionsPage,
});

function QuestionsPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [category, setCategory] = useState<QuestionCategory | "all">("all");
  const [difficulty, setDifficulty] = useState<QuestionDifficulty | "all">("all");
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: ["questions", category, difficulty],
    queryFn: () =>
      listQuestions({
        category: category === "all" ? undefined : category,
        difficulty: difficulty === "all" ? undefined : difficulty,
      }),
  });

  const categories = useMemo(() => {
    const set = new Set<QuestionCategory>();
    query.data?.forEach((q) => set.add(q.category));
    return Array.from(set);
  }, [query.data]);

  const difficulties = useMemo(() => {
    const set = new Set<QuestionDifficulty>();
    query.data?.forEach((q) => set.add(q.difficulty));
    return Array.from(set);
  }, [query.data]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return (query.data ?? []).filter((q) => !s || q.text.toLowerCase().includes(s));
  }, [query.data, search]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("questions.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("questions.subtitle")}</p>
      </div>

      <Card className="p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("questions.search")}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={(v) => setCategory(v as QuestionCategory | "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("questions.category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("questions.allCategories")}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={difficulty}
          onValueChange={(v) => setDifficulty(v as QuestionDifficulty | "all")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("questions.difficulty")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("questions.allDifficulties")}</SelectItem>
            {difficulties.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      <div className="space-y-2">
        {query.isLoading &&
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        {!query.isLoading && filtered.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground">{t("questions.empty")}</Card>
        )}
        {filtered.map((q) => (
          <Card
            key={q.id}
            className="p-4 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer"
            onClick={() =>
              navigate({
                to: "/questions/$questionId",
                params: { questionId: String(q.id) },
              })
            }
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm leading-relaxed flex-1">{q.text}</p>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex flex-wrap gap-1 justify-end">
                  <Badge variant="secondary">{q.category}</Badge>
                  <Badge variant="outline">{q.difficulty}</Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({
                      to: "/ask",
                      search: { questionId: String(q.id) },
                    });
                  }}
                >
                  <Play className="mr-2 h-3.5 w-3.5" />
                  {t("questions.test")}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
