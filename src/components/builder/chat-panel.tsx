import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateForm } from "@/lib/ai.functions";
import { useFormStore } from "@/lib/form-store";
import { toast } from "sonner";
import { Sparkles, ArrowUp, Loader2 } from "lucide-react";
import type { FormField } from "@/lib/field-types";

type Msg =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; pending?: boolean };

const SUGGESTIONS = [
  "Build a yoga retreat registration with session picker and Stripe payment",
  "Create a job application with resume upload, signature and Likert experience scale",
  "Make a customer NPS survey with rating, multi-select and a comment field",
];

export function ChatPanel() {
  const fetchAI = useServerFn(generateForm);
  const { form, applyAIPatch } = useFormStore();
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Hey — describe the form you want to build, or iterate on what's on the canvas. I'll handle the field types, options and layout.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }, { role: "assistant", content: "", pending: true }]);
    setBusy(true);
    try {
      const result = await fetchAI({ data: { prompt: text, currentForm: form } });
      applyAIPatch({
        title: result.title,
        description: result.description,
        fields: result.fields as FormField[],
      });
      setMessages((m) => {
        const next = [...m];
        next[next.length - 1] = { role: "assistant", content: result.summary };
        return next;
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
      setMessages((m) => {
        const next = [...m];
        next[next.length - 1] = { role: "assistant", content: `⚠ ${msg}` };
        return next;
      });
    } finally {
      setBusy(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <aside className="w-[340px] border-r border-border bg-card flex flex-col shrink-0">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Form Architect</h2>
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-primary animate-shimmer" />
          <span className="text-[10px] font-mono text-muted-foreground">AI online</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-thin p-4 space-y-5">
        {messages.map((m, i) => (
          <div key={i} className="animate-entrance">
            <div className="text-[10px] font-mono text-muted-foreground mb-1.5 uppercase tracking-widest">
              {m.role === "user" ? "You" : "AI"}
            </div>
            {m.role === "assistant" && m.pending ? (
              <div className="bg-muted/60 border border-dashed border-border p-3 rounded-xl rounded-tl-none">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3 animate-spin" />
                  Designing fields...
                </div>
              </div>
            ) : (
              <div
                className={`p-3 rounded-xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary/5 border border-primary/10 rounded-tr-none"
                    : "bg-muted rounded-tl-none"
                }`}
              >
                {m.content}
              </div>
            )}
          </div>
        ))}

        {messages.length <= 1 && (
          <div className="space-y-2 pt-2">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="size-3" /> Try
            </div>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full text-left text-xs p-2.5 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border bg-muted/30">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Describe your form, or a change..."
            className="w-full bg-card border border-border rounded-xl p-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[88px] resize-none shadow-xs"
            disabled={busy}
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground hidden md:block">⌘↵</span>
            <button
              onClick={() => send(input)}
              disabled={busy || !input.trim()}
              className="size-7 bg-primary text-primary-foreground rounded-md grid place-items-center disabled:opacity-40 hover:brightness-110 transition-all"
              aria-label="Send"
            >
              {busy ? <Loader2 className="size-3.5 animate-spin" /> : <ArrowUp className="size-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
