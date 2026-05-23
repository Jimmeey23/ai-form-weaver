import { useState } from "react";
import type { FormField } from "@/lib/field-types";
import { Star, Upload, Mic, ChevronDown, Plus, Minus } from "lucide-react";

// A live, interactive (but non-submitting) renderer for every field type.
export function FieldRenderer({ field }: { field: FormField }) {
  switch (field.type) {
    case "heading":
      return <h2 className="text-2xl font-bold tracking-tight">{field.label}</h2>;
    case "paragraph":
      return <p className="text-muted-foreground leading-relaxed">{field.content || field.label}</p>;
    case "banner":
      return (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm">
          <div className="font-semibold text-primary mb-1">{field.label}</div>
          {field.content && <div className="text-muted-foreground">{field.content}</div>}
        </div>
      );

    case "short_answer":
    case "email":
    case "url":
      return (
        <input
          type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
          placeholder={field.placeholder || "Type your answer..."}
          className="w-full border-b border-border pb-2 text-lg focus:outline-none focus:border-primary transition-colors bg-transparent"
        />
      );

    case "long_answer":
    case "rich_text":
      return (
        <textarea
          placeholder={field.placeholder || "Write your answer..."}
          rows={4}
          className="w-full border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary transition-colors bg-transparent resize-none"
        />
      );

    case "password":
      return (
        <input
          type="password"
          placeholder="••••••••"
          className="w-full border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary bg-transparent"
        />
      );

    case "number":
      return (
        <input
          type="number"
          placeholder={field.placeholder || "0"}
          className="w-40 border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary bg-transparent"
        />
      );

    case "currency":
      return (
        <div className="flex items-center border border-border rounded-lg overflow-hidden w-48">
          <span className="px-3 py-2.5 bg-muted text-sm font-mono text-muted-foreground">
            {field.currency || "USD"}
          </span>
          <input
            type="number"
            placeholder="0.00"
            className="flex-1 p-2.5 text-sm focus:outline-none bg-transparent"
          />
        </div>
      );

    case "phone":
      return (
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <span className="px-3 py-2.5 bg-muted text-sm font-mono">+1</span>
          <input
            type="tel"
            placeholder="(555) 000-0000"
            className="flex-1 p-2.5 text-sm focus:outline-none bg-transparent"
          />
        </div>
      );

    case "address":
      return (
        <div className="space-y-2">
          <input placeholder="Street address" className="w-full border border-border rounded-lg p-2.5 text-sm bg-transparent" />
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="City" className="border border-border rounded-lg p-2.5 text-sm bg-transparent" />
            <input placeholder="State" className="border border-border rounded-lg p-2.5 text-sm bg-transparent" />
            <input placeholder="ZIP" className="border border-border rounded-lg p-2.5 text-sm bg-transparent" />
          </div>
        </div>
      );

    case "email_otp":
      return (
        <div className="space-y-2">
          <input type="email" placeholder="you@example.com" className="w-full border border-border rounded-lg p-2.5 text-sm bg-transparent" />
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="size-10 border border-border rounded-md grid place-items-center text-sm font-mono text-muted-foreground">·</div>
            ))}
          </div>
        </div>
      );

    case "dropdown":
      return (
        <button className="w-full flex items-center justify-between border border-border rounded-lg p-2.5 text-sm text-left bg-transparent">
          <span className="text-muted-foreground">{field.placeholder || "Select an option..."}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      );

    case "multiple_choice":
      return (
        <div className="space-y-2">
          {(field.options || []).map((o) => (
            <label key={o.value} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:border-primary/40 cursor-pointer transition-colors">
              <span className="size-4 rounded-full border-2 border-border" />
              <span className="text-sm">{o.label}</span>
            </label>
          ))}
        </div>
      );

    case "multiselect":
      return (
        <div className="space-y-2">
          {(field.options || []).map((o) => (
            <label key={o.value} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:border-primary/40 cursor-pointer transition-colors">
              <span className="size-4 rounded border-2 border-border" />
              <span className="text-sm">{o.label}</span>
            </label>
          ))}
        </div>
      );

    case "single_checkbox":
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <span className="size-5 rounded border-2 border-border" />
          <span className="text-sm">{field.placeholder || "I agree"}</span>
        </label>
      );

    case "switch":
      return (
        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
          <span className="text-sm">{field.placeholder || field.label}</span>
          <span className="w-9 h-5 bg-muted rounded-full relative">
            <span className="absolute left-0.5 top-0.5 size-4 bg-white rounded-full shadow-sm" />
          </span>
        </div>
      );

    case "picture_choice":
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(field.options || []).map((o) => (
            <div key={o.value} className="border border-border rounded-lg overflow-hidden hover:border-primary cursor-pointer transition-colors">
              <div className="aspect-video bg-muted grid place-items-center text-muted-foreground text-xs">
                {o.imageUrl ? <img src={o.imageUrl} alt={o.label} className="object-cover w-full h-full" /> : "Image"}
              </div>
              <div className="p-2 text-xs text-center">{o.label}</div>
            </div>
          ))}
        </div>
      );

    case "checkbox_grid":
    case "choice_matrix":
    case "likert_table": {
      const m = field.matrix || { rows: ["Row 1", "Row 2"], columns: ["A", "B", "C"] };
      return (
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 text-left font-medium text-muted-foreground"></th>
                {m.columns.map((c) => (
                  <th key={c} className="p-2 font-medium text-muted-foreground text-center text-xs">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {m.rows.map((r) => (
                <tr key={r} className="border-t border-border">
                  <td className="p-2">{r}</td>
                  {m.columns.map((c) => (
                    <td key={c} className="p-2 text-center">
                      <span className="inline-block size-4 rounded-full border-2 border-border" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case "date_picker":
    case "datetime_picker":
    case "time_picker":
      return (
        <input
          type={field.type === "time_picker" ? "time" : field.type === "datetime_picker" ? "datetime-local" : "date"}
          className="border border-border rounded-lg p-2.5 text-sm bg-transparent"
        />
      );

    case "date_range":
      return (
        <div className="flex items-center gap-2">
          <input type="date" className="border border-border rounded-lg p-2.5 text-sm bg-transparent" />
          <span className="text-muted-foreground">→</span>
          <input type="date" className="border border-border rounded-lg p-2.5 text-sm bg-transparent" />
        </div>
      );

    case "appointment_slots":
      return (
        <div className="grid grid-cols-3 gap-2">
          {["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"].map((t) => (
            <button key={t} className="border border-border rounded-lg p-2 text-sm hover:border-primary hover:bg-primary/5 transition-colors">
              {t}
            </button>
          ))}
        </div>
      );

    case "rating":
    case "opinion_scale": {
      const max = field.max ?? 5;
      return (
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: max }).map((_, i) => (
            <div
              key={i}
              className={`size-10 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                i === 3 ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-primary hover:text-white hover:border-primary"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      );
    }

    case "star_rating":
      return (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className={`size-7 ${i <= 4 ? "fill-primary text-primary" : "text-border"}`} />
          ))}
        </div>
      );

    case "slider":
      return (
        <div className="space-y-2">
          <div className="relative h-2 bg-muted rounded-full">
            <div className="absolute left-0 top-0 h-full w-2/3 bg-primary rounded-full" />
            <div className="absolute left-2/3 top-1/2 -translate-y-1/2 -translate-x-1/2 size-4 bg-white border-2 border-primary rounded-full shadow" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>{field.min ?? 0}</span>
            <span>{field.max ?? 100}</span>
          </div>
        </div>
      );

    case "ranking":
      return (
        <div className="space-y-2">
          {(field.options || []).map((o, i) => (
            <div key={o.value} className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <span className="size-6 rounded bg-muted text-xs font-mono grid place-items-center">{i + 1}</span>
              <span className="text-sm flex-1">{o.label}</span>
              <span className="text-muted-foreground">≡</span>
            </div>
          ))}
        </div>
      );

    case "color_picker":
      return (
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary border border-border" />
          <input type="text" defaultValue="#3B82F6" className="border border-border rounded-lg p-2.5 text-sm font-mono bg-transparent w-32" />
        </div>
      );

    case "file_upload":
      return (
        <div className="border border-dashed border-border rounded-xl p-6 text-center bg-muted/30">
          <Upload className="size-6 mx-auto text-muted-foreground mb-2" />
          <div className="text-sm font-medium">Drop a file or click to upload</div>
          <div className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</div>
        </div>
      );

    case "signature":
      return (
        <div className="h-32 w-full bg-muted/40 border border-dashed border-border rounded-lg grid place-items-center">
          <span className="text-xs font-mono text-muted-foreground">Sign here...</span>
        </div>
      );

    case "voice_recording":
      return (
        <div className="flex items-center gap-3 p-4 border border-border rounded-xl">
          <div className="size-10 rounded-full bg-primary text-primary-foreground grid place-items-center">
            <Mic className="size-4" />
          </div>
          <div>
            <div className="text-sm font-medium">Tap to record</div>
            <div className="text-xs text-muted-foreground">Up to 5 minutes</div>
          </div>
        </div>
      );

    case "stripe_payment":
      return (
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-muted/30">
            <div className="text-sm">
              <div className="font-medium">{field.label || "Payment"}</div>
              <div className="text-xs text-muted-foreground">Secured by Stripe</div>
            </div>
            <div className="text-xl font-bold font-mono">
              {(field.currency || "USD")} {(field.amount ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="p-4 space-y-2">
            <div className="h-10 bg-muted/40 border border-border rounded-md flex items-center px-3 text-xs text-muted-foreground font-mono">4242 4242 4242 4242</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-10 bg-muted/40 border border-border rounded-md flex items-center px-3 text-xs text-muted-foreground font-mono">MM / YY</div>
              <div className="h-10 bg-muted/40 border border-border rounded-md flex items-center px-3 text-xs text-muted-foreground font-mono">CVC</div>
            </div>
            <button className="w-full h-10 bg-foreground text-background rounded-md text-xs font-semibold">Pay now</button>
          </div>
        </div>
      );

    case "section_break":
      return (
        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{field.label}</h3>
        </div>
      );

    case "section_collapse":
      return (
        <button className="w-full flex items-center justify-between p-4 border border-border rounded-lg">
          <span className="font-medium">{field.label}</span>
          <ChevronDown className="size-4" />
        </button>
      );

    case "divider":
      return <hr className="border-border" />;

    case "spacer":
      return <div className="h-6" />;

    case "html_snippet":
      return (
        <pre className="bg-muted/40 border border-border rounded-lg p-3 text-xs font-mono overflow-x-auto">
          {field.content || "<!-- custom HTML -->"}
        </pre>
      );

    case "page_break":
      return (
        <div className="flex items-center gap-3 my-2">
          <span className="flex-1 h-px bg-border" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Page Break</span>
          <span className="flex-1 h-px bg-border" />
        </div>
      );

    case "hidden_field":
      return (
        <div className="text-xs font-mono text-muted-foreground bg-muted/40 border border-dashed border-border rounded p-2">
          hidden: {field.label}
        </div>
      );

    case "image":
      return (
        <div className="aspect-video bg-muted rounded-lg grid place-items-center text-muted-foreground text-xs">
          Image placeholder
        </div>
      );

    case "video":
      return (
        <div className="aspect-video bg-muted rounded-lg grid place-items-center text-muted-foreground text-xs">
          ▶ Video
        </div>
      );

    case "pdf_viewer":
      return (
        <div className="aspect-[4/3] bg-muted rounded-lg grid place-items-center text-muted-foreground text-xs">
          PDF document
        </div>
      );

    case "social_links":
      return (
        <div className="flex gap-2">
          {["IG", "TW", "LI", "FB"].map((l) => (
            <div key={l} className="size-9 rounded-full border border-border grid place-items-center text-xs font-mono">{l}</div>
          ))}
        </div>
      );

    case "lookup_field":
    case "submission_picker":
    case "momence_member_search":
      return (
        <div className="border border-border rounded-lg p-2.5 text-sm bg-transparent flex items-center justify-between text-muted-foreground">
          <span>Search {field.label}...</span>
          <span className="text-xs font-mono">⌘K</span>
        </div>
      );

    case "formula_field":
      return (
        <div className="font-mono text-xs bg-muted/40 border border-border rounded p-3">
          ƒ(x) = {field.content || "sum(amount) * 1.1"}
        </div>
      );

    case "conditional_field":
    case "dependent_field":
      return (
        <div className="border border-dashed border-primary/40 bg-primary/5 rounded-lg p-3 text-xs">
          <span className="font-mono uppercase tracking-wider text-primary">IF</span>{" "}
          {field.content || "previous answer matches → show this"}
        </div>
      );

    case "momence_sessions_picker":
      return (
        <div className="grid grid-cols-2 gap-2">
          {["Morning Flow", "Sunset Meditation"].map((s, i) => (
            <div key={s} className={`p-3 rounded-lg border space-y-1 ${i === 1 ? "border-primary bg-primary/5" : "border-border"}`}>
              <div className="text-sm font-medium">{s}</div>
              <div className="text-[10px] text-muted-foreground font-mono">08:00 AM • Studio A</div>
            </div>
          ))}
        </div>
      );

    case "momence_hosted_class":
      return (
        <div className="p-3 rounded-lg border border-border space-y-1">
          <div className="text-sm font-medium">Vinyasa Flow</div>
          <div className="text-xs text-muted-foreground">60 min • Sarah J.</div>
        </div>
      );

    case "subform":
      return (
        <div className="border-2 border-dashed border-border rounded-xl p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Subform</div>
          <div className="space-y-2">
            <div className="h-8 bg-muted/40 rounded" />
            <div className="h-8 bg-muted/40 rounded w-3/4" />
          </div>
          <button className="mt-3 text-xs font-medium text-primary flex items-center gap-1"><Plus className="size-3" />Add row</button>
        </div>
      );

    default:
      return (
        <div className="text-xs font-mono text-muted-foreground p-3 bg-muted/40 rounded border border-dashed border-border">
          {field.type}
        </div>
      );
  }
}

// kept to satisfy bundler about unused imports
void Minus;
