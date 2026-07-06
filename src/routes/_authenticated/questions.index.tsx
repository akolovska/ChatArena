import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { listQuestions } from "@/api/questions";
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
import { Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/questions/")({
  component: QuestionsPage,
});

function QuestionsPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
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
    const set = new Set<string>();
    query.data?.forEach((q) => q.category && set.add(q.category));
    return Array.from(set);
  }, [query.data]);

  const difficulties = useMemo(() => {
    const set = new Set<string>();
    query.data?.forEach((q) => q.difficulty && set.add(q.difficulty));
    return Array.from(set);
  }, [query.data]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return (query.data ?? []).filter(
      (q) => !s || q.text.toLowerCase().includes(s),
    );
  }, [query.data, search]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Банка на прашања
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Прегледајте ги прашањата и одберете едно за тестирање.
        </p>
      </div>

      <Card className="p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пребарај..."
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Категорија" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Сите категории</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Тежина" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Сите тежини</SelectItem>
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
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        {!query.isLoading && filtered.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground">
            Нема пронајдени прашања.
          </Card>
        )}
        {filtered.map((q) => (
          <Card
            key={q.id}
            className="p-4 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer"
            onClick={() =>
              navigate({
                to: "/ask",
                search: { questionId: String(q.id) },
              })
            }
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm leading-relaxed">{q.text}</p>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {q.category && (
                  <Badge variant="secondary">{q.category}</Badge>
                )}
                {q.difficulty && (
                  <Badge variant="outline">{q.difficulty}</Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
