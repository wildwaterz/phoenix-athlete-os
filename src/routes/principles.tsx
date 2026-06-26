import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Surface } from "@/components/app-shell";
import { Flame } from "lucide-react";
import { PRINCIPLES } from "@/lib/phoenix-data";

export const Route = createFileRoute("/principles")({
  head: () => ({
    meta: [
      { title: "Principles · Phoenix OS" },
      { name: "description", content: "The philosophy behind the Athlete Operating System." },
    ],
  }),
  component: PrinciplesPage,
});

function PrinciplesPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Foundation"
        title="Principles"
        description="The operating philosophy of Project Phoenix. Read once a week. Live by it every day."
      />

      <Surface className="mb-6 overflow-hidden p-7">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-phoenix shadow-phoenix">
            <Flame className="h-6 w-6 text-phoenix-foreground" />
          </div>
          <div>
            <div className="text-xl font-semibold tracking-tight">Project Phoenix</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Phoenix is not a rehab app. It is an Athlete Operating System — a framework for
              organizing recovery, training, and long-term performance around objective evidence
              and milestone-based progression. Phoenix never makes medical decisions; it
              organizes data so the people who do can decide better.
            </p>
          </div>
        </div>
      </Surface>

      <div className="grid gap-3 md:grid-cols-2">
        {PRINCIPLES.map((p, i) => (
          <Surface key={p.title} className="p-5">
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-phoenix">
              Principle {String(i + 1).padStart(2, "0")}
            </div>
            <div className="mt-2 text-lg font-semibold tracking-tight">{p.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
          </Surface>
        ))}
      </div>
    </AppShell>
  );
}