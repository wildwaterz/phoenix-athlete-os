import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Surface } from "@/components/app-shell";
import { setState, usePhoenix } from "@/lib/phoenix-data";
import { Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Coach Journal · Phoenix OS" },
      { name: "description", content: "Observations, interpretations, decisions, and next focus." },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  const s = usePhoenix();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    observation: "",
    interpretation: "",
    decision: "",
    xpAwarded: 25,
    nextFocus: "",
  });

  const submit = () => {
    if (!form.observation.trim()) return;
    setState((prev) => ({
      ...prev,
      journal: [
        {
          id: `j-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          ...form,
        },
        ...prev.journal,
      ],
      recoveryIqXp: prev.recoveryIqXp + Number(form.xpAwarded || 0),
    }));
    setForm({ observation: "", interpretation: "", decision: "", xpAwarded: 25, nextFocus: "" });
    setOpen(false);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Coaching"
        title="Coach Journal"
        description="A timeline of observation → interpretation → decision → next focus."
        action={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-phoenix px-3.5 py-2 text-sm font-medium text-phoenix-foreground shadow-phoenix"
          >
            <Plus className="h-4 w-4" /> New entry
          </button>
        }
      />

      <ol className="relative space-y-4 border-l border-border pl-6">
        {s.journal.map((j) => (
          <li key={j.id} className="relative">
            <span className="absolute -left-[27px] top-3 h-2.5 w-2.5 rounded-full bg-gradient-phoenix shadow-[0_0_12px_var(--color-phoenix-glow)]" />
            <Surface>
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {j.date}
                </div>
                <div className="text-[11px] font-semibold text-phoenix">+{j.xpAwarded} XP</div>
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Observation</dt>
                  <dd>{j.observation}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Interpretation</dt>
                  <dd>{j.interpretation}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Decision</dt>
                  <dd>{j.decision}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Next focus</dt>
                  <dd className="text-phoenix">{j.nextFocus}</dd>
                </div>
              </dl>
            </Surface>
          </li>
        ))}
      </ol>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="surface-card w-full max-w-xl rounded-2xl p-5">
            <div className="mb-4 text-sm font-semibold">New journal entry</div>
            <div className="space-y-3">
              {(["observation", "interpretation", "decision", "nextFocus"] as const).map((k) => (
                <label key={k} className="block">
                  <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                    {k === "nextFocus" ? "Next focus" : k}
                  </span>
                  <textarea
                    rows={2}
                    value={form[k]}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none focus:border-phoenix"
                  />
                </label>
              ))}
              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                  XP awarded
                </span>
                <input
                  type="number"
                  value={form.xpAwarded}
                  onChange={(e) => setForm({ ...form, xpAwarded: Number(e.target.value) })}
                  className="w-32 rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none focus:border-phoenix"
                />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                className="rounded-lg bg-gradient-phoenix px-3 py-1.5 text-sm font-medium text-phoenix-foreground"
              >
                Save entry
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}