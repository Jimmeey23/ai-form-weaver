import { useFormStore } from "@/lib/form-store";

export function BuilderHeader() {
  const { form } = useFormStore();
  return (
    <nav className="h-14 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0 z-50">
      <div className="flex items-center gap-4">
        <div className="size-8 bg-foreground rounded-lg flex items-center justify-center">
          <div className="size-3 bg-background rounded-full" />
        </div>
        <div className="h-4 w-px bg-border" />
        <span className="text-sm font-semibold tracking-tight">Symmetry</span>
        <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase tracking-wider">
          v0.1
        </span>
        <span className="hidden md:inline text-xs text-muted-foreground border-l border-border pl-3 ml-1">
          {form.title}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
          <span className="size-1.5 bg-emerald-500 rounded-full" />
          {form.fields.length} fields
        </span>
        <div className="flex items-center bg-muted rounded-md p-0.5">
          <button className="px-3 py-1 text-xs font-medium bg-card shadow-xs rounded-sm">Edit</button>
          <button className="px-3 py-1 text-xs font-medium text-muted-foreground">Preview</button>
        </div>
        <button className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-md shadow-sm hover:brightness-110 transition-all">
          Publish
        </button>
      </div>
    </nav>
  );
}
