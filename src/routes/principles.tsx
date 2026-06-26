import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Surface } from "@/components/app-shell";
import { Flame } from "lucide-react";

export const Route = createFileRoute("/principles")({
  head: () => ({
    meta: [
      { title: "Principles · Phoenix OS" },
      { name: "description", content: "The philosophy behind the Athlete Operating System." },
    ],
  }),
  component: PrinciplesPage,
});

const PRINCIPLES = [
  { title: "Progression is earned, never assumed.", body: "The calendar does not promote you. Evidence does." },
  { title: "Recovery is training.", body: "What you do between sessions decides what the next session can be." },
  { title: "Adaptations matter more than exercises.", body: "The exercise is a stimulus. The adaptation is the point." },
  { title: "Competency matters more than timelines.", body: "Move when you've earned it — not when the protocol says so." },
  { title: "Evidence beats ego.", body: "What the data says wins over what you want to be true." },
  { title: "Tomorrow's response matters more than today's workout.", body: "If today breaks tomorrow, today wasn't a win." },
];

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