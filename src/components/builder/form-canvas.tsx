import { useFormStore } from "@/lib/form-store";
import { FieldRenderer } from "./field-renderer";
import { FIELD_TYPE_LABELS } from "@/lib/field-types";
import { GripVertical, Trash2, ChevronUp, ChevronDown } from "lucide-react";

export function FormCanvas() {
  const { form, selectedId, select, setTitle, setDescription, removeField, moveField } = useFormStore();

  return (
    <main className="flex-1 bg-background overflow-y-auto scroll-thin">
      <div className="max-w-[680px] mx-auto px-8 py-12">
        <div className="mb-12 space-y-3">
          <input
            value={form.title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl font-bold tracking-tight bg-transparent focus:outline-none placeholder:text-muted-foreground/40"
            placeholder="Untitled form"
          />
          <textarea
            value={form.description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Add a description..."
            className="w-full text-muted-foreground bg-transparent focus:outline-none resize-none placeholder:text-muted-foreground/40"
          />
        </div>

        <div className="space-y-3">
          {form.fields.map((field, idx) => {
            const isSelected = field.id === selectedId;
            return (
              <div
                key={field.id}
                onClick={() => select(field.id)}
                className={`group relative p-6 bg-card border rounded-2xl shadow-xs transition-all cursor-pointer animate-entrance ${
                  isSelected ? "border-primary/60 ring-2 ring-primary/10" : "border-border hover:border-primary/30"
                }`}
              >
                {/* Drag handle / index */}
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveField(field.id, -1); }}
                    className="p-1 bg-card border border-border rounded text-muted-foreground hover:text-foreground"
                    aria-label="Move up"
                  >
                    <ChevronUp className="size-3" />
                  </button>
                  <div className="p-1 bg-card border border-border rounded text-muted-foreground cursor-grab">
                    <GripVertical className="size-3" />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveField(field.id, 1); }}
                    className="p-1 bg-card border border-border rounded text-muted-foreground hover:text-foreground"
                    aria-label="Move down"
                  >
                    <ChevronDown className="size-3" />
                  </button>
                </div>

                <div className="flex items-start justify-between mb-3 gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    {FIELD_TYPE_LABELS[field.type] || field.type}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">#{idx + 1}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
                      aria-label="Delete field"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {field.type !== "heading" && field.type !== "paragraph" && field.type !== "banner" && field.type !== "divider" && field.type !== "spacer" && field.type !== "page_break" && (
                  <h3 className="text-lg font-medium mb-4 leading-snug">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </h3>
                )}

                <FieldRenderer field={field} />

                {field.description && (
                  <p className="text-xs text-muted-foreground mt-3">{field.description}</p>
                )}
              </div>
            );
          })}

          {form.fields.length === 0 && (
            <div className="border border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground">
              <p className="text-sm">No fields yet. Describe your form to the AI on the left.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
