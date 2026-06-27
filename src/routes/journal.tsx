import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Surface } from "@/components/app-shell";
import {
  allEveningCheckIns,
  allMorningCheckIns,
  currentPhase,
  dailyQuestsForDate,
  readinessForDate,
  setState,
  type AthleteNote,
  type CoachNote,
  type CoachNoteAppliesTo,
  type CoachNotePriority,
  type CoachNoteSource,
  type CoachNoteType,
  type PhoenixState,
  type Readiness,
  usePhoenix,
} from "@/lib/phoenix-data";
import { cn } from "@/lib/utils";
import { BookOpen, ClipboardCheck, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal · Phoenix OS" },
      {
        name: "description",
        content: "Notes, coach feedback, and system history for your recovery.",
      },
    ],
  }),
  component: JournalPage,
});

type JournalTab = "athlete" | "coach" | "system";

type SystemHistoryItem = {
  id: string;
  date: string;
  createdAt: string;
  type: string;
  title: string;
  detail: string;
  xp?: number;
};

const tabs: { id: JournalTab; label: string }[] = [
  { id: "athlete", label: "Athlete Notes" },
  { id: "coach", label: "Coach Notes" },
  { id: "system", label: "System History" },
];

const coachNoteSources: CoachNoteSource[] = ["ChatGPT", "physio", "surgeon", "trainer", "other"];

const coachNoteTypes: CoachNoteType[] = [
  "evening_review",
  "physio_note",
  "surgeon_note",
  "restriction",
  "milestone",
  "general",
];

const appliesToOptions: CoachNoteAppliesTo[] = [
  "today",
  "current_phase",
  "until_next_appointment",
  "custom",
];

const priorityOptions: CoachNotePriority[] = ["normal", "important", "override"];

const today = () => new Date().toISOString().slice(0, 10);

const emptyCoachForm = () => ({
  date: today(),
  source: "ChatGPT" as CoachNoteSource,
  noteType: "general" as CoachNoteType,
  authorName: "",
  summary: "",
  fullNote: "",
  nextFocus: "",
  appliesTo: "today" as CoachNoteAppliesTo,
  priority: "normal" as CoachNotePriority,
  tags: "",
});

const emptyAthleteForm = () => ({
  date: today(),
  body: "",
  tags: "",
});

function JournalPage() {
  const s = usePhoenix();
  const [tab, setTab] = useState<JournalTab>("athlete");
  const [athleteOpen, setAthleteOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const [athleteForm, setAthleteForm] = useState(emptyAthleteForm);
  const [coachForm, setCoachForm] = useState(emptyCoachForm);

  const athleteNotes = [...s.athleteNotes].sort(sortByCreatedAt);
  const coachNotes = [...s.coachNotes].sort(sortByCreatedAt);
  const systemHistory = useMemo(() => buildSystemHistory(s), [s]);
  const hasNotes = athleteNotes.length > 0 || coachNotes.length > 0;

  const openActiveComposer = () => {
    if (tab === "athlete") setAthleteOpen(true);
    if (tab === "coach") setCoachOpen(true);
  };

  const submitAthleteNote = () => {
    if (!athleteForm.body.trim()) return;
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      athleteNotes: [
        {
          id: `athlete-note-${Date.now()}`,
          date: athleteForm.date,
          body: athleteForm.body.trim(),
          tags: parseTags(athleteForm.tags),
          relatedPhaseId: currentPhase(prev).id,
          createdAt: now,
        },
        ...prev.athleteNotes,
      ],
    }));
    setAthleteForm(emptyAthleteForm());
    setAthleteOpen(false);
  };

  const submitCoachNote = () => {
    if (!coachForm.summary.trim() && !coachForm.fullNote.trim()) return;
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      coachNotes: [
        {
          id: `coach-note-${Date.now()}`,
          date: coachForm.date,
          source: coachForm.source,
          noteType: coachForm.noteType,
          authorName: coachForm.authorName.trim() || undefined,
          summary: coachForm.summary.trim() || coachForm.fullNote.trim().split("\n")[0],
          fullNote: coachForm.fullNote.trim(),
          nextFocus: coachForm.nextFocus.trim() || undefined,
          appliesTo: coachForm.appliesTo,
          priority: coachForm.priority,
          relatedPhaseId:
            coachForm.appliesTo === "current_phase" ? currentPhase(prev).id : undefined,
          tags: parseTags(coachForm.tags),
          createdAt: now,
        },
        ...prev.coachNotes,
      ],
    }));
    setCoachForm(emptyCoachForm());
    setCoachOpen(false);
  };

  const action =
    tab === "system" ? undefined : (
      <button
        onClick={openActiveComposer}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-phoenix px-3.5 py-2 text-sm font-medium text-phoenix-foreground shadow-phoenix"
      >
        <Plus className="h-4 w-4" />
        {tab === "athlete" ? "Add athlete note" : "Paste coach note"}
      </button>
    );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Evidence"
        title="Journal"
        description="Notes, coach feedback, and system history for your recovery."
        action={action}
      />

      <div className="mb-5 inline-flex rounded-xl border border-border bg-card p-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm transition",
              tab === item.id
                ? "bg-gradient-phoenix text-phoenix-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "athlete" && (
        <JournalList
          empty={!hasNotes || athleteNotes.length === 0}
          emptyMessage={
            hasNotes
              ? "No athlete notes yet."
              : "No notes yet. Add an athlete note, paste a coach note, or import a Daily Coach Plan."
          }
        >
          {athleteNotes.map((note) => (
            <AthleteNoteCard key={note.id} note={note} />
          ))}
        </JournalList>
      )}

      {tab === "coach" && (
        <JournalList
          empty={!hasNotes || coachNotes.length === 0}
          emptyMessage="No coach notes yet. Paste a note from your physio, surgeon, trainer, or AI assistant."
        >
          {coachNotes.map((note) => (
            <CoachNoteCard key={note.id} note={note} />
          ))}
        </JournalList>
      )}

      {tab === "system" && (
        <JournalList empty={systemHistory.length === 0} emptyMessage="No system history yet.">
          {systemHistory.map((item) => (
            <SystemHistoryCard key={item.id} item={item} />
          ))}
        </JournalList>
      )}

      {athleteOpen && (
        <ModalFrame title="Add athlete note" onClose={() => setAthleteOpen(false)}>
          <div className="space-y-3">
            <Field label="Date">
              <TextInput
                type="date"
                value={athleteForm.date}
                onChange={(event) => setAthleteForm({ ...athleteForm, date: event.target.value })}
              />
            </Field>
            <Field label="Note">
              <TextArea
                rows={5}
                value={athleteForm.body}
                onChange={(event) => setAthleteForm({ ...athleteForm, body: event.target.value })}
                placeholder="Symptoms, questions, decisions, or context you want to keep."
              />
            </Field>
            <Field label="Tags">
              <TextInput
                value={athleteForm.tags}
                onChange={(event) => setAthleteForm({ ...athleteForm, tags: event.target.value })}
                placeholder="morning-context, question, symptoms"
              />
            </Field>
          </div>
          <ModalActions
            onCancel={() => setAthleteOpen(false)}
            onSubmit={submitAthleteNote}
            submitLabel="Save note"
          />
        </ModalFrame>
      )}

      {coachOpen && (
        <ModalFrame title="Paste coach note" onClose={() => setCoachOpen(false)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Date">
              <TextInput
                type="date"
                value={coachForm.date}
                onChange={(event) => setCoachForm({ ...coachForm, date: event.target.value })}
              />
            </Field>
            <Field label="Source">
              <SelectInput
                value={coachForm.source}
                onChange={(event) =>
                  setCoachForm({ ...coachForm, source: event.target.value as CoachNoteSource })
                }
              >
                {coachNoteSources.map((source) => (
                  <option key={source} value={source}>
                    {formatLabel(source)}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Note type">
              <SelectInput
                value={coachForm.noteType}
                onChange={(event) =>
                  setCoachForm({ ...coachForm, noteType: event.target.value as CoachNoteType })
                }
              >
                {coachNoteTypes.map((type) => (
                  <option key={type} value={type}>
                    {formatLabel(type)}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Author">
              <TextInput
                value={coachForm.authorName}
                onChange={(event) => setCoachForm({ ...coachForm, authorName: event.target.value })}
                placeholder="Optional"
              />
            </Field>
            <Field label="Applies to">
              <SelectInput
                value={coachForm.appliesTo}
                onChange={(event) =>
                  setCoachForm({
                    ...coachForm,
                    appliesTo: event.target.value as CoachNoteAppliesTo,
                  })
                }
              >
                {appliesToOptions.map((scope) => (
                  <option key={scope} value={scope}>
                    {formatLabel(scope)}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Priority">
              <SelectInput
                value={coachForm.priority}
                onChange={(event) =>
                  setCoachForm({ ...coachForm, priority: event.target.value as CoachNotePriority })
                }
              >
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {formatLabel(priority)}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Summary">
                <TextInput
                  value={coachForm.summary}
                  onChange={(event) => setCoachForm({ ...coachForm, summary: event.target.value })}
                  placeholder="Short context summary"
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Full note">
                <TextArea
                  rows={7}
                  value={coachForm.fullNote}
                  onChange={(event) => setCoachForm({ ...coachForm, fullNote: event.target.value })}
                  placeholder="Paste feedback from ChatGPT, your physio, surgeon, or trainer."
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Next focus">
                <TextInput
                  value={coachForm.nextFocus}
                  onChange={(event) =>
                    setCoachForm({ ...coachForm, nextFocus: event.target.value })
                  }
                  placeholder="Optional"
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Tags">
                <TextInput
                  value={coachForm.tags}
                  onChange={(event) => setCoachForm({ ...coachForm, tags: event.target.value })}
                  placeholder="restriction, swelling, rom"
                />
              </Field>
            </div>
          </div>
          <ModalActions
            onCancel={() => setCoachOpen(false)}
            onSubmit={submitCoachNote}
            submitLabel="Save note"
          />
        </ModalFrame>
      )}
    </AppShell>
  );
}

function JournalList({
  empty,
  emptyMessage,
  children,
}: {
  empty: boolean;
  emptyMessage: string;
  children: React.ReactNode;
}) {
  if (empty) {
    return (
      <Surface>
        <div className="flex items-start gap-3">
          <BookOpen className="mt-0.5 h-5 w-5 text-phoenix" />
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      </Surface>
    );
  }

  return <div className="space-y-4">{children}</div>;
}

function AthleteNoteCard({ note }: { note: AthleteNote }) {
  return (
    <Surface>
      <CardHeader eyebrow="Athlete Note" date={note.date} createdAt={note.createdAt} />
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{note.body}</p>
      <TagRow tags={note.tags} />
    </Surface>
  );
}

function CoachNoteCard({ note }: { note: CoachNote }) {
  return (
    <Surface>
      <CardHeader
        eyebrow={`${formatLabel(note.source)} · ${formatLabel(note.noteType)}`}
        date={note.date}
        createdAt={note.createdAt}
        badge={formatLabel(note.priority)}
        badgeTone={
          note.priority === "override"
            ? "alert"
            : note.priority === "important"
              ? "watch"
              : "default"
        }
      />
      {note.authorName && (
        <div className="mt-2 text-xs text-muted-foreground">Author · {note.authorName}</div>
      )}
      <div className="mt-3 text-sm font-medium">{note.summary}</div>
      {note.fullNote && (
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {note.fullNote}
        </p>
      )}
      {note.nextFocus && (
        <div className="mt-3 rounded-lg border border-border bg-background/40 p-3 text-sm">
          <span className="text-muted-foreground">Next focus · </span>
          <span className="text-foreground">{note.nextFocus}</span>
        </div>
      )}
      <div className="mt-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        Applies to · {formatLabel(note.appliesTo)}
      </div>
      <TagRow tags={note.tags} />
    </Surface>
  );
}

function SystemHistoryCard({ item }: { item: SystemHistoryItem }) {
  return (
    <Surface>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <ClipboardCheck className="h-3.5 w-3.5 text-phoenix" />
            {item.type} · {item.date}
          </div>
          <div className="mt-2 text-sm font-semibold">{item.title}</div>
          <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
        </div>
        {item.xp != null && (
          <div className="shrink-0 rounded-md bg-phoenix/10 px-2 py-1 text-[11px] font-semibold text-phoenix">
            {item.xp > 0 ? "+" : ""}
            {item.xp} XP
          </div>
        )}
      </div>
    </Surface>
  );
}

function CardHeader({
  eyebrow,
  date,
  createdAt,
  badge,
  badgeTone = "default",
}: {
  eyebrow: string;
  date: string;
  createdAt: string;
  badge?: string;
  badgeTone?: "default" | "watch" | "alert";
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-phoenix">
          {eyebrow}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {date} · {formatDateTime(createdAt)}
        </div>
      </div>
      {badge && (
        <div
          className={cn(
            "rounded-md px-2 py-1 text-[11px] font-medium uppercase tracking-[0.14em]",
            badgeTone === "alert"
              ? "bg-destructive/10 text-destructive"
              : badgeTone === "watch"
                ? "bg-warning/10 text-warning"
                : "bg-muted text-muted-foreground",
          )}
        >
          {badge}
        </div>
      )}
    </div>
  );
}

function TagRow({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-md border border-border bg-background/40 px-2 py-1 text-[11px] text-muted-foreground"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function ModalFrame({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="surface-card max-h-[85vh] w-full max-w-2xl overflow-auto rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold">{title}</div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalActions({
  onCancel,
  onSubmit,
  submitLabel,
}: {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  return (
    <div className="mt-5 flex justify-end gap-2">
      <button
        onClick={onCancel}
        className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent"
      >
        Cancel
      </button>
      <button
        onClick={onSubmit}
        className="rounded-lg bg-gradient-phoenix px-3 py-1.5 text-sm font-medium text-phoenix-foreground"
      >
        {submitLabel}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none focus:border-phoenix",
        props.className,
      )}
    />
  );
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none focus:border-phoenix",
        props.className,
      )}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none focus:border-phoenix",
        props.className,
      )}
    />
  );
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function sortByCreatedAt(a: { createdAt: string }, b: { createdAt: string }) {
  return a.createdAt < b.createdAt ? 1 : -1;
}

function formatLabel(value: string) {
  if (value === "ChatGPT") return value;
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function systemDateTime(date: string, time: string) {
  return `${date}T${time}.000Z`;
}

function buildSystemHistory(s: PhoenixState): SystemHistoryItem[] {
  const items: SystemHistoryItem[] = [];

  allMorningCheckIns(s).forEach((entry) => {
    items.push({
      id: `morning-${entry.date}`,
      date: entry.date,
      createdAt: systemDateTime(entry.date, "07:00:00"),
      type: "Check-in",
      title: "Morning check-in logged",
      detail: `Pain ${entry.pain}/10, swelling ${entry.swellingLevel ?? entry.swelling}/10, walking confidence ${entry.walkingConfidence}/5.`,
    });
  });

  allEveningCheckIns(s).forEach((entry) => {
    items.push({
      id: `evening-${entry.date}`,
      date: entry.date,
      createdAt: systemDateTime(entry.date, "20:00:00"),
      type: "Check-in",
      title: "Evening check-in logged",
      detail: `Pain after ${entry.painAfter}/10, swelling change ${entry.swellingChange}, walking confidence after ${entry.walkingConfidenceAfter ?? entry.walkingConfidence}/5.`,
    });
  });

  const readinessByDate = new Map<string, Readiness["state"]>();
  allMorningCheckIns(s)
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .forEach((entry) => {
      const readiness = readinessForDate(s, entry.date);
      const previous = Array.from(readinessByDate.values()).at(-1);
      readinessByDate.set(entry.date, readiness.state);
      if (previous && previous === readiness.state) return;
      items.push({
        id: `readiness-${entry.date}-${readiness.state}`,
        date: entry.date,
        createdAt: systemDateTime(entry.date, "07:05:00"),
        type: "Readiness",
        title: `Readiness set to ${readiness.label}`,
        detail: readiness.summary,
      });
    });

  Object.entries(s.questCompletions ?? {}).forEach(([date, completions]) => {
    const quests = dailyQuestsForDate(s, date);
    Object.entries(completions).forEach(([questId, done]) => {
      if (!done) return;
      const quest = quests.find((item) => item.id === questId);
      items.push({
        id: `quest-${date}-${questId}`,
        date,
        createdAt: systemDateTime(date, "12:00:00"),
        type: "Quest",
        title: "Quest completed",
        detail: quest?.label ?? questId,
      });
    });
  });

  s.recoveryIqEvents.forEach((event) => {
    items.push({
      id: `xp-${event.id}`,
      date: event.date,
      createdAt: event.timestamp || event.createdAt,
      type: "Recovery IQ",
      title: event.title,
      detail: event.description ?? formatLabel(event.sourceType),
      xp: event.xpAmount,
    });
  });

  s.milestones
    .filter((milestone) => milestone.status === "unlocked")
    .forEach((milestone) => {
      const date = milestone.unlockedAt?.slice(0, 10) ?? today();
      items.push({
        id: `milestone-${milestone.id}`,
        date,
        createdAt: milestone.unlockedAt ?? systemDateTime(date, "13:00:00"),
        type: "Milestone",
        title: milestone.name,
        detail: milestone.evidence,
      });
    });

  return dedupeHistory(items).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

function dedupeHistory(items: SystemHistoryItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
