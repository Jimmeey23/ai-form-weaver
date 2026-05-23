// Comprehensive field type catalog for the AI form builder.

export type FieldType =
  // Display
  | "heading" | "paragraph" | "banner"
  // Text
  | "short_answer" | "long_answer" | "rich_text"
  // Choices
  | "dropdown" | "picture_choice" | "multiselect" | "switch" | "multiple_choice"
  | "single_checkbox" | "checkbox_grid" | "choice_matrix" | "likert_table"
  // Time
  | "date_picker" | "datetime_picker" | "time_picker" | "date_range" | "appointment_slots"
  // Rating & Ranking
  | "rating" | "ranking" | "star_rating" | "slider" | "opinion_scale"
  // Contact
  | "email" | "email_otp" | "phone" | "address"
  // Number
  | "number" | "currency"
  // Payments
  | "stripe_payment"
  // Misc
  | "url" | "color_picker" | "password" | "file_upload" | "signature"
  | "voice_recording" | "submission_picker" | "subform"
  // Navigation & Layout
  | "section_break" | "section_collapse" | "divider" | "spacer" | "html_snippet"
  | "page_break" | "hidden_field"
  // Media
  | "image" | "video" | "pdf_viewer" | "social_links"
  // Advanced
  | "lookup_field" | "formula_field" | "conditional_field" | "dependent_field"
  // Integrations
  | "momence_member_search" | "momence_sessions_picker" | "momence_hosted_class";

export interface FieldOption {
  label: string;
  value: string;
  imageUrl?: string;
}

export interface MatrixConfig {
  rows: string[];
  columns: string[];
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  matrix?: MatrixConfig;
  min?: number;
  max?: number;
  step?: number;
  currency?: string;
  amount?: number;
  content?: string; // for display blocks
  variant?: string; // banner/heading style
}

export interface FormSchema {
  title: string;
  description?: string;
  fields: FormField[];
}

export const FIELD_CATEGORIES: { name: string; types: { type: FieldType; label: string }[] }[] = [
  {
    name: "Display",
    types: [
      { type: "heading", label: "Heading" },
      { type: "paragraph", label: "Paragraph" },
      { type: "banner", label: "Banner" },
    ],
  },
  {
    name: "Text",
    types: [
      { type: "short_answer", label: "Short Answer" },
      { type: "long_answer", label: "Long Answer" },
      { type: "rich_text", label: "Rich Text" },
    ],
  },
  {
    name: "Choices",
    types: [
      { type: "dropdown", label: "Dropdown" },
      { type: "picture_choice", label: "Picture Choice" },
      { type: "multiselect", label: "Multiselect" },
      { type: "switch", label: "Switch" },
      { type: "multiple_choice", label: "Multiple Choice" },
      { type: "single_checkbox", label: "Single Checkbox" },
      { type: "checkbox_grid", label: "Checkbox Grid" },
      { type: "choice_matrix", label: "Choice Matrix" },
      { type: "likert_table", label: "Likert Table" },
    ],
  },
  {
    name: "Time",
    types: [
      { type: "date_picker", label: "Date" },
      { type: "datetime_picker", label: "Date & Time" },
      { type: "time_picker", label: "Time" },
      { type: "date_range", label: "Date Range" },
      { type: "appointment_slots", label: "Appointment Slots" },
    ],
  },
  {
    name: "Rating",
    types: [
      { type: "rating", label: "Rating" },
      { type: "ranking", label: "Ranking" },
      { type: "star_rating", label: "Star Rating" },
      { type: "slider", label: "Slider" },
      { type: "opinion_scale", label: "Opinion Scale" },
    ],
  },
  {
    name: "Contact",
    types: [
      { type: "email", label: "Email" },
      { type: "email_otp", label: "Email + OTP" },
      { type: "phone", label: "Phone" },
      { type: "address", label: "Address" },
    ],
  },
  {
    name: "Number",
    types: [
      { type: "number", label: "Number" },
      { type: "currency", label: "Currency" },
    ],
  },
  {
    name: "Payments",
    types: [{ type: "stripe_payment", label: "Stripe Payment" }],
  },
  {
    name: "Misc",
    types: [
      { type: "url", label: "URL" },
      { type: "color_picker", label: "Color" },
      { type: "password", label: "Password" },
      { type: "file_upload", label: "File Upload" },
      { type: "signature", label: "Signature" },
      { type: "voice_recording", label: "Voice" },
      { type: "submission_picker", label: "Submission Picker" },
      { type: "subform", label: "Subform" },
    ],
  },
  {
    name: "Layout",
    types: [
      { type: "section_break", label: "Section" },
      { type: "section_collapse", label: "Collapse" },
      { type: "divider", label: "Divider" },
      { type: "spacer", label: "Spacer" },
      { type: "html_snippet", label: "HTML" },
      { type: "page_break", label: "Page Break" },
      { type: "hidden_field", label: "Hidden" },
    ],
  },
  {
    name: "Media",
    types: [
      { type: "image", label: "Image" },
      { type: "video", label: "Video" },
      { type: "pdf_viewer", label: "PDF" },
      { type: "social_links", label: "Social Links" },
    ],
  },
  {
    name: "Advanced",
    types: [
      { type: "lookup_field", label: "Lookup" },
      { type: "formula_field", label: "Formula" },
      { type: "conditional_field", label: "Conditional" },
      { type: "dependent_field", label: "Dependent" },
    ],
  },
  {
    name: "Momence",
    types: [
      { type: "momence_member_search", label: "Member Search" },
      { type: "momence_sessions_picker", label: "Sessions" },
      { type: "momence_hosted_class", label: "Hosted Class" },
    ],
  },
];

export const FIELD_TYPE_LABELS: Record<FieldType, string> = Object.fromEntries(
  FIELD_CATEGORIES.flatMap((c) => c.types.map((t) => [t.type, t.label])),
) as Record<FieldType, string>;

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export const STARTER_FORM: FormSchema = {
  title: "Quarterly Performance Review",
  description:
    "Please complete your self-assessment and authorize the compensation schedule for the upcoming cycle.",
  fields: [
    {
      id: newId(),
      type: "short_answer",
      label: "What was your primary achievement this quarter?",
      placeholder: "Type your answer here...",
      required: true,
    },
    {
      id: newId(),
      type: "opinion_scale",
      label: "How would you rate your team collaboration?",
      min: 1,
      max: 5,
    },
    {
      id: newId(),
      type: "multiple_choice",
      label: "Which area do you want to grow in next quarter?",
      options: [
        { label: "Technical depth", value: "tech" },
        { label: "Leadership", value: "lead" },
        { label: "Communication", value: "comm" },
        { label: "Product strategy", value: "prod" },
      ],
    },
    {
      id: newId(),
      type: "signature",
      label: "Authorized Signature",
      required: true,
    },
  ],
};
