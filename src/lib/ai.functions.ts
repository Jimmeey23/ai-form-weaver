import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const FieldSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  label: z.string(),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  options: z
    .array(z.object({ label: z.string(), value: z.string(), imageUrl: z.string().optional() }))
    .optional(),
  matrix: z.object({ rows: z.array(z.string()), columns: z.array(z.string()) }).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  currency: z.string().optional(),
  amount: z.number().optional(),
  content: z.string().optional(),
  variant: z.string().optional(),
});

const INPUT = z.object({
  prompt: z.string().min(1).max(4000),
  currentForm: z.object({
    title: z.string(),
    description: z.string().optional(),
    fields: z.array(FieldSchema),
  }),
});

const SYSTEM = `You are an expert form designer for an AI form builder.
Given a user's natural-language description and the current form, produce an updated form schema.

Allowed field "type" values (use EXACTLY these strings):
heading, paragraph, banner, short_answer, long_answer, rich_text, dropdown, picture_choice, multiselect, switch, multiple_choice, single_checkbox, checkbox_grid, choice_matrix, likert_table, date_picker, datetime_picker, time_picker, date_range, appointment_slots, rating, ranking, star_rating, slider, opinion_scale, email, email_otp, phone, address, number, currency, stripe_payment, url, color_picker, password, file_upload, signature, voice_recording, submission_picker, subform, section_break, section_collapse, divider, spacer, html_snippet, page_break, hidden_field, image, video, pdf_viewer, social_links, lookup_field, formula_field, conditional_field, dependent_field, momence_member_search, momence_sessions_picker, momence_hosted_class.

FIELD TYPE SELECTION GUIDE — pick the MOST SPECIFIC type. Do NOT default to multiselect/multiple_choice for everything:
- Appointment / booking / time slot / "pick a time" → appointment_slots (NOT multiselect, NOT dropdown).
- Single date → date_picker. Date + time → datetime_picker. Just time → time_picker. Range of dates → date_range.
- Email address → email. Phone → phone. Mailing address → address. URL/website → url. Password → password.
- Money / price / amount in $ → currency. Numeric quantity → number.
- Payment / checkout / "pay $X" → stripe_payment (set amount + currency).
- File / resume / document upload → file_upload. Image upload only is still file_upload.
- Signature / sign here → signature. Voice / audio recording → voice_recording.
- 1–5 stars → star_rating. 1–10 / NPS / scale → opinion_scale. Drag to rank order → ranking. Drag a value → slider.
- Yes/no toggle → switch. Single agree checkbox / terms → single_checkbox.
- Pick ONE from a list → multiple_choice (≤6 opts) or dropdown (>6 opts) or picture_choice (visual).
- Pick MANY from a list → multiselect.
- Grid of checkboxes (rows × cols, multi per row) → checkbox_grid.
- Single choice per row across columns → choice_matrix. Agree↔Disagree scale matrix → likert_table.
- Search/select an existing record → lookup_field or submission_picker.
- Auto-computed value → formula_field. Show/hide based on another field → conditional_field / dependent_field.
- Section title between groups of fields → section_break. Big intro banner → banner. Static info text → paragraph. Title → heading.
- Momence-specific: member lookup → momence_member_search; class/session picker → momence_sessions_picker; live class embed → momence_hosted_class.

Rules:
- Use rich VARIETY. A good form mixes input types — avoid making everything a multiselect or short_answer.
- For choice fields, provide 2-7 thoughtful, realistic options (label + lowercase_value).
- For matrix/likert, fill rows AND columns.
- For payments, include amount and currency (e.g. amount: 4900, currency: "usd").
- For sliders/scales, set min, max, and step.
- Organize long forms with section_break or banner blocks.
- Keep field labels concise and human.
- If iterating, preserve existing fields where sensible and only add/modify what's needed.
- Provide a clean, engaging form title and description.

Return the COMPLETE new form via the build_form tool.`;

export const generateForm = createServerFn({ method: "POST" })
  .inputValidator((d: z.infer<typeof INPUT>) => INPUT.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI gateway not configured");

    const userMsg = `Current form:\n${JSON.stringify(data.currentForm, null, 2)}\n\nUser request:\n${data.prompt}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userMsg },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "build_form",
              description: "Return the complete updated form schema",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  summary: { type: "string", description: "1-2 sentence note about what changed" },
                  fields: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string" },
                        label: { type: "string" },
                        description: { type: "string" },
                        placeholder: { type: "string" },
                        required: { type: "boolean" },
                        options: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              label: { type: "string" },
                              value: { type: "string" },
                            },
                            required: ["label", "value"],
                          },
                        },
                        matrix: {
                          type: "object",
                          properties: {
                            rows: { type: "array", items: { type: "string" } },
                            columns: { type: "array", items: { type: "string" } },
                          },
                        },
                        min: { type: "number" },
                        max: { type: "number" },
                        step: { type: "number" },
                        currency: { type: "string" },
                        amount: { type: "number" },
                        content: { type: "string" },
                      },
                      required: ["type", "label"],
                    },
                  },
                },
                required: ["title", "fields", "summary"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "build_form" } },
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Rate limit reached. Please wait a moment and try again.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in Settings → Workspace → Usage.");
      throw new Error(`AI error ${res.status}: ${text.slice(0, 200)}`);
    }

    const json = await res.json();
    const call = json.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("AI did not return a form");
    const parsed = JSON.parse(call.function.arguments);
    return {
      title: parsed.title as string,
      description: parsed.description as string | undefined,
      summary: parsed.summary as string,
      fields: parsed.fields as z.infer<typeof FieldSchema>[],
    };
  });
