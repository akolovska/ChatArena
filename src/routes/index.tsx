import { createFileRoute, redirect } from "@tanstack/react-router";
import { getStoredAuth } from "@/lib/auth-storage";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const auth = getStoredAuth();
    if (auth) throw redirect({ to: "/ask" });
    throw redirect({ to: "/login" });
  },
});
