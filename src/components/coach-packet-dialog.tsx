import { useMemo, useState } from "react";
import { buildPacketJson, buildPacketMarkdown, type PacketKind } from "@/lib/coach-packet";
import { usePhoenix } from "@/lib/phoenix-data";
import { Copy, Download, X, FileJson, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function CoachPacketDialog({
  kind,
  onClose,
}: {
  kind: PacketKind;
  onClose: () => void;
}) {
  const s = usePhoenix();
  const [tab, setTab] = useState<"markdown" | "json">("markdown");
  const [copied, setCopied] = useState(false);

  const markdown = useMemo(() => buildPacketMarkdown(kind, s), [kind, s]);
  const json = useMemo(() => JSON.stringify(buildPacketJson(kind, s), null, 2), [kind, s]);
  const content = tab === "markdown" ? markdown : json;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const download = () => {
    const blob = new Blob([content], {
      type: tab === "json" ? "application/json" : "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `phoenix-${kind}-packet.${tab === "json" ? "json" : "md"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="surface-card flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-phoenix">
              Coach Packet
            </div>
            <div className="text-base font-semibold capitalize">{kind} export</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-3">
          <div className="inline-flex rounded-lg border border-border bg-background/40 p-1 text-xs">
            {(["markdown", "json"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 capitalize",
                  tab === t
                    ? "bg-gradient-phoenix text-phoenix-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t === "markdown" ? <FileText className="h-3.5 w-3.5" /> : <FileJson className="h-3.5 w-3.5" />}
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-accent"
            >
              <Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={download}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-phoenix px-3 py-1.5 text-xs font-medium text-phoenix-foreground"
            >
              <Download className="h-3.5 w-3.5" /> Download
            </button>
          </div>
        </div>
        <pre className="flex-1 overflow-auto bg-background/40 p-5 font-mono text-[12px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {content}
        </pre>
      </div>
    </div>
  );
}