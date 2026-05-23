import { useState } from "react";
import {
  Type, AlignLeft, Heading, Image as ImageIcon, Star, Calendar, Clock,
  Mail, Phone, MapPin, Hash, DollarSign, CreditCard, Link as LinkIcon,
  Palette, Lock, Upload, PenLine, Mic, Layers, Box, Minus, Space, Code,
  FileText, Video, Eye, Sigma, GitBranch, Search, Users, ChevronsUpDown,
  ListChecks, CheckSquare, ToggleRight, Grid3x3, Table, ListOrdered,
  SlidersHorizontal, BarChart3, Megaphone, ArrowDownToLine, EyeOff, Wand2,
} from "lucide-react";
import type { FieldType } from "@/lib/field-types";

const ICONS: Partial<Record<FieldType, React.ComponentType<{ className?: string }>>> = {
  heading: Heading, paragraph: AlignLeft, banner: Megaphone,
  short_answer: Type, long_answer: AlignLeft, rich_text: FileText,
  dropdown: ChevronsUpDown, picture_choice: ImageIcon, multiselect: ListChecks,
  switch: ToggleRight, multiple_choice: CheckSquare, single_checkbox: CheckSquare,
  checkbox_grid: Grid3x3, choice_matrix: Table, likert_table: BarChart3,
  date_picker: Calendar, datetime_picker: Calendar, time_picker: Clock,
  date_range: Calendar, appointment_slots: Calendar,
  rating: Star, ranking: ListOrdered, star_rating: Star, slider: SlidersHorizontal,
  opinion_scale: BarChart3,
  email: Mail, email_otp: Mail, phone: Phone, address: MapPin,
  number: Hash, currency: DollarSign, stripe_payment: CreditCard,
  url: LinkIcon, color_picker: Palette, password: Lock, file_upload: Upload,
  signature: PenLine, voice_recording: Mic, submission_picker: Search, subform: Layers,
  section_break: Box, section_collapse: Box, divider: Minus, spacer: Space,
  html_snippet: Code, page_break: ArrowDownToLine, hidden_field: EyeOff,
  image: ImageIcon, video: Video, pdf_viewer: FileText, social_links: LinkIcon,
  lookup_field: Search, formula_field: Sigma, conditional_field: GitBranch,
  dependent_field: GitBranch, momence_member_search: Users,
  momence_sessions_picker: Calendar, momence_hosted_class: Eye,
};

export function FieldIcon({ type, className }: { type: FieldType; className?: string }) {
  const Icon = ICONS[type] ?? Wand2;
  return <Icon className={className} />;
}

export function useToggle(initial = false) {
  const [v, set] = useState(initial);
  return [v, () => set((x) => !x), set] as const;
}
