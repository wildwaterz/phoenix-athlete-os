import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Surface } from "@/components/app-shell";
import { useState } from "react";
import { Search } from "lucide-react";

export const Route = createFileRoute("/glossary")({
  head: () => ({
    meta: [
      { title: "Glossary · Phoenix OS" },
      { name: "description", content: "Rehab terminology in athlete-friendly language." },
    ],
  }),
  component: GlossaryPage,
});

type Term = { term: string; def: string; category: "Recovery" | "Mobility" | "Strength" | "Training" };

const TERMS: Term[] = [
  { category: "Recovery", term: "Reactive joint", def: "A joint showing inflammation, warmth, or swelling — a signal that yesterday's load exceeded current capacity." },
  { category: "Recovery", term: "Capacity", def: "How much load your tissues currently tolerate without a next-day spike in swelling or pain." },
  { category: "Recovery", term: "DOMS", def: "Delayed onset muscle soreness — a normal training response, not a damage signal." },
  { category: "Mobility", term: "Extension", def: "Straightening the joint. For the knee, 0° is neutral; full passive extension is the goal." },
  { category: "Mobility", term: "Flexion", def: "Bending the joint. Full knee flexion typically reaches around 135°." },
  { category: "Mobility", term: "End-range pinch", def: "A sharp sensation at the limit of motion. Usually indicates pushing past current capacity." },
  { category: "Strength", term: "Quad activation", def: "Voluntary recruitment of the quadriceps — the gate to load tolerance after knee injury." },
  { category: "Strength", term: "Quad lag", def: "Inability to lock the knee in the last few degrees of extension during a straight leg raise." },
  { category: "Strength", term: "LSI", def: "Limb Symmetry Index — performance of the injured side as a percentage of the uninjured side." },
  { category: "Training", term: "Volume", def: "Total work performed — sets × reps × load. The dial you adjust based on tomorrow's response." },
  { category: "Training", term: "Progression", def: "Earned increase in load, range, or complexity — never assumed by the calendar." },
  { category: "Training", term: "Deload", def: "Planned reduction in volume to let adaptations consolidate." },
];

function GlossaryPage() {
  const [q, setQ] = useState("");
  const cats = ["Recovery", "Mobility", "Strength", "Training"] as const;
  const filtered = TERMS.filter(
    (t) =>
      t.term.toLowerCase().includes(q.toLowerCase()) ||
      t.def.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Reference"
        title="Glossary"
        description="Plain-language definitions for the terms you'll see across Phoenix."
      />

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search terms…"
          className="w-full rounded-xl border border-border bg-background/40 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-phoenix"
        />
      </div>

      <div className="space-y-8">
        {cats.map((c) => {
          const items = filtered.filter((t) => t.category === c);
          if (items.length === 0) return null;
          return (
            <section key={c}>
              <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                <span>{c}</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {items.map((t) => (
                  <Surface key={t.term} className="p-4">
                    <div className="text-sm font-semibold">{t.term}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{t.def}</p>
                  </Surface>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}