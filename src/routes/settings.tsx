import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Surface } from "@/components/app-shell";
import { setState, usePhoenix } from "@/lib/phoenix-data";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Phoenix OS" },
      { name: "description", content: "Athlete profile and data controls." },
    ],
  }),
  component: SettingsPage,
});

const FUTURE = [
  "Nutrition",
  "Strength Training",
  "Conditioning",
  "Wearables",
  "Physiotherapist Portal",
  "AI Coach",
  "Hockey Readiness",
  "Analytics",
  "Body Composition",
];

function SettingsPage() {
  const s = usePhoenix();
  const setName = (v: string) => setState((prev) => ({ ...prev, athleteName: v }));
  const reset = () => {
    if (!confirm("Reset all Phoenix data on this device?")) return;
    try {
      window.localStorage.removeItem("phoenix-os:v1");
      window.location.reload();
    } catch {
      /* ignore */
    }
  };

  return (
    <AppShell>
      <PageHeader eyebrow="Profile" title="Settings" description="Local-first. Your data lives on this device for now." />

      <Surface className="mb-6">
        <div className="mb-3 text-sm font-semibold">Athlete</div>
        <label className="block max-w-sm">
          <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Display name</span>
          <input
            value={s.athleteName}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none focus:border-phoenix"
          />
        </label>
      </Surface>

      <Surface className="mb-6">
        <div className="mb-1 text-sm font-semibold">Roadmap modules</div>
        <p className="mb-4 text-xs text-muted-foreground">
          These modules are part of the Phoenix architecture and will plug into the same data
          model. Not yet enabled.
        </p>
        <div className="flex flex-wrap gap-2">
          {FUTURE.map((f) => (
            <span
              key={f}
              className="rounded-full border border-border bg-background/40 px-3 py-1 text-xs text-muted-foreground"
            >
              {f}
            </span>
          ))}
        </div>
      </Surface>

      <Surface>
        <div className="mb-1 text-sm font-semibold">Data</div>
        <p className="mb-4 text-xs text-muted-foreground">
          Reset everything — check-ins, journal, XP, milestones — back to the seed state.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-2 text-sm text-destructive hover:bg-destructive/20"
        >
          <Trash2 className="h-4 w-4" /> Reset local data
        </button>
      </Surface>
    </AppShell>
  );
}