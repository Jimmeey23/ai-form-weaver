import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type FormSchema, type FormField, newId, STARTER_FORM } from "./field-types";

interface FormStoreValue {
  form: FormSchema;
  selectedId: string | null;
  setForm: (f: FormSchema) => void;
  setTitle: (t: string) => void;
  setDescription: (d: string) => void;
  addField: (f: Omit<FormField, "id">) => void;
  updateField: (id: string, patch: Partial<FormField>) => void;
  removeField: (id: string) => void;
  moveField: (id: string, dir: -1 | 1) => void;
  select: (id: string | null) => void;
  applyAIPatch: (patch: { title?: string; description?: string; fields?: FormField[]; appendFields?: FormField[] }) => void;
}

const Ctx = createContext<FormStoreValue | null>(null);

export function FormStoreProvider({ children }: { children: ReactNode }) {
  const [form, setForm] = useState<FormSchema>(STARTER_FORM);
  const [selectedId, setSelectedId] = useState<string | null>(STARTER_FORM.fields[0]?.id ?? null);

  const setTitle = useCallback((t: string) => setForm((f) => ({ ...f, title: t })), []);
  const setDescription = useCallback((d: string) => setForm((f) => ({ ...f, description: d })), []);

  const addField: FormStoreValue["addField"] = useCallback((f) => {
    const id = newId();
    setForm((cur) => ({ ...cur, fields: [...cur.fields, { ...f, id }] }));
    setSelectedId(id);
  }, []);

  const updateField: FormStoreValue["updateField"] = useCallback((id, patch) => {
    setForm((cur) => ({
      ...cur,
      fields: cur.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }));
  }, []);

  const removeField: FormStoreValue["removeField"] = useCallback((id) => {
    setForm((cur) => ({ ...cur, fields: cur.fields.filter((f) => f.id !== id) }));
    setSelectedId((s) => (s === id ? null : s));
  }, []);

  const moveField: FormStoreValue["moveField"] = useCallback((id, dir) => {
    setForm((cur) => {
      const idx = cur.fields.findIndex((f) => f.id === id);
      const next = idx + dir;
      if (idx < 0 || next < 0 || next >= cur.fields.length) return cur;
      const fields = [...cur.fields];
      [fields[idx], fields[next]] = [fields[next], fields[idx]];
      return { ...cur, fields };
    });
  }, []);

  const applyAIPatch: FormStoreValue["applyAIPatch"] = useCallback((patch) => {
    setForm((cur) => {
      let fields = cur.fields;
      if (patch.fields) {
        fields = patch.fields.map((f) => ({ ...f, id: f.id ?? newId() }));
      } else if (patch.appendFields) {
        fields = [...fields, ...patch.appendFields.map((f) => ({ ...f, id: f.id ?? newId() }))];
      }
      return {
        title: patch.title ?? cur.title,
        description: patch.description ?? cur.description,
        fields,
      };
    });
  }, []);

  return (
    <Ctx.Provider
      value={{
        form,
        selectedId,
        setForm,
        setTitle,
        setDescription,
        addField,
        updateField,
        removeField,
        moveField,
        select: setSelectedId,
        applyAIPatch,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useFormStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFormStore must be used within FormStoreProvider");
  return ctx;
}
