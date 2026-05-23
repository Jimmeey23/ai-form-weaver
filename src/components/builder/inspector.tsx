import { useFormStore } from "@/lib/form-store";
import { FIELD_CATEGORIES, FIELD_TYPE_LABELS, type FieldType } from "@/lib/field-types";
import { FieldIcon } from "./field-icon";
import { useState } from "react";

export function Inspector() {
  const { form, selectedId, updateField, addField } = useFormStore();
  const field = form.fields.find((f) => f.id === selectedId);
  const [tab, setTab] = useState<"props" | "library">(field ? "props" : "library");

  return (
    <aside className="w-[300px] border-l border-border bg-card shrink-0 overflow-y-auto scroll-thin flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex bg-muted rounded-md p-0.5">
          <button
            onClick={() => setTab("props")}
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm transition ${
              tab === "props" ? "bg-card shadow-xs" : "text-muted-foreground"
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setTab("library")}
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm transition ${
              tab === "library" ? "bg-card shadow-xs" : "text-muted-foreground"
            }`}
          >
            Library
          </button>
        </div>
        {field && <span className="text-[10px] font-mono text-muted-foreground">#{field.id.slice(0, 6)}</span>}
      </div>

      {tab === "props" && field && (
        <div className="p-4 space-y-6">
          <Section title="Field Configuration">
            <Labelled label="Type">
              <div className="flex items-center gap-2 px-2 py-1.5 bg-muted rounded border border-border text-xs">
                <FieldIcon type={field.type} className="size-3.5 text-muted-foreground" />
                {FIELD_TYPE_LABELS[field.type]}
              </div>
            </Labelled>
            <Labelled label="Label">
              <input
                value={field.label}
                onChange={(e) => updateField(field.id, { label: e.target.value })}
                className="w-full text-xs p-2 border border-border rounded shadow-xs focus:outline-none focus:ring-1 focus:ring-primary bg-transparent"
              />
            </Labelled>
            <Labelled label="Description">
              <input
                value={field.description ?? ""}
                onChange={(e) => updateField(field.id, { description: e.target.value })}
                className="w-full text-xs p-2 border border-border rounded shadow-xs focus:outline-none focus:ring-1 focus:ring-primary bg-transparent"
              />
            </Labelled>
            <Labelled label="Placeholder">
              <input
                value={field.placeholder ?? ""}
                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                className="w-full text-xs p-2 border border-border rounded shadow-xs focus:outline-none focus:ring-1 focus:ring-primary bg-transparent"
              />
            </Labelled>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium">Required</span>
              <button
                onClick={() => updateField(field.id, { required: !field.required })}
                className={`w-8 h-4 rounded-full relative transition-colors ${field.required ? "bg-primary" : "bg-muted-foreground/30"}`}
              >
                <span className={`absolute size-3 bg-white rounded-full top-0.5 shadow-sm transition-all ${field.required ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
          </Section>

          {(field.type === "stripe_payment" || field.type === "currency") && (
            <Section title="Money">
              <Labelled label="Amount">
                <input
                  type="number"
                  value={field.amount ?? 0}
                  onChange={(e) => updateField(field.id, { amount: parseFloat(e.target.value) })}
                  className="w-full text-xs p-2 border border-border rounded bg-transparent"
                />
              </Labelled>
              <Labelled label="Currency">
                <input
                  value={field.currency ?? "USD"}
                  onChange={(e) => updateField(field.id, { currency: e.target.value.toUpperCase() })}
                  className="w-full text-xs p-2 border border-border rounded font-mono bg-transparent"
                />
              </Labelled>
            </Section>
          )}

          {(field.options || ["dropdown", "multiple_choice", "multiselect", "picture_choice", "ranking"].includes(field.type)) && (
            <Section title="Options">
              <div className="space-y-1">
                {(field.options || []).map((o, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <input
                      value={o.label}
                      onChange={(e) => {
                        const next = [...(field.options || [])];
                        next[i] = { ...o, label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, "_") };
                        updateField(field.id, { options: next });
                      }}
                      className="flex-1 text-xs p-1.5 border border-border rounded bg-transparent"
                    />
                    <button
                      onClick={() => updateField(field.id, { options: (field.options || []).filter((_, j) => j !== i) })}
                      className="text-xs text-muted-foreground hover:text-destructive px-1"
                    >×</button>
                  </div>
                ))}
                <button
                  onClick={() => updateField(field.id, { options: [...(field.options || []), { label: "New option", value: `opt_${Date.now()}` }] })}
                  className="text-[11px] text-primary font-medium"
                >+ Add option</button>
              </div>
            </Section>
          )}

          <Section title="Logic & Branching">
            <div className="p-3 bg-muted/40 border border-border rounded-lg space-y-2">
              <button className="text-[11px] font-medium text-primary">+ Add conditional rule</button>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Ask the AI to "show this field only if X is selected" and it'll wire up the logic.
              </p>
            </div>
          </Section>
        </div>
      )}

      {tab === "props" && !field && (
        <div className="p-6 text-xs text-muted-foreground text-center">
          Select a field on the canvas to edit its properties.
        </div>
      )}

      {tab === "library" && (
        <div className="p-4 space-y-5">
          {FIELD_CATEGORIES.map((cat) => (
            <div key={cat.name} className="space-y-2">
              <h3 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{cat.name}</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {cat.types.map((t) => (
                  <button
                    key={t.type}
                    onClick={() => addField(defaultFieldFor(t.type, t.label))}
                    className="flex flex-col items-center gap-1.5 p-2.5 border border-border rounded-lg bg-card hover:bg-muted hover:border-primary/40 transition-colors text-center"
                  >
                    <FieldIcon type={t.type} className="size-4 text-muted-foreground" />
                    <span className="text-[10px] font-medium leading-tight">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{title}</h3>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function Labelled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function defaultFieldFor(type: FieldType, label: string) {
  const base: any = { type, label };
  if (["dropdown", "multiple_choice", "multiselect", "picture_choice", "ranking"].includes(type)) {
    base.options = [
      { label: "Option A", value: "a" },
      { label: "Option B", value: "b" },
      { label: "Option C", value: "c" },
    ];
  }
  if (type === "stripe_payment") {
    base.amount = 49;
    base.currency = "USD";
  }
  if (type === "currency") base.currency = "USD";
  if (type === "opinion_scale" || type === "rating" || type === "slider") {
    base.min = 1;
    base.max = type === "slider" ? 100 : 5;
  }
  if (["checkbox_grid", "choice_matrix", "likert_table"].includes(type)) {
    base.matrix = {
      rows: ["Row 1", "Row 2", "Row 3"],
      columns: ["Low", "Medium", "High"],
    };
  }
  return base;
}
