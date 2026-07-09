// ═══════════════════════════════════════════════════════════════════
//  FORM ENGINE · types
//  Generic building blocks for ReadyExpat form products (Steuer,
//  Abmeldung, Vollmacht, …). A new form = a data file with these types
//  + an answer-sheet builder — not a rebuild. See README.md.
// ═══════════════════════════════════════════════════════════════════

export type FieldDef<TForm> = {
  key: keyof TForm & string;
  label: string;              // English label shown in wizard
  deLabel: string;            // German original (small, builds recognition for the real form)
  type: "text" | "date" | "select" | "boolean" | "euro";
  options?: { value: string; label: string }[]; // for select
  placeholder?: string;
  explain: string;            // short neutral explanation, always visible
  more?: string;              // deep dive, opens on click; \n = block (see MoreInfo parser)
  decision?: boolean;         // renders the neutral your-decision banner
  showIf?: (f: TForm) => boolean;
  required?: boolean | ((f: TForm) => boolean);
  // For selects whose form value is not a plain string (e.g. boolean | null):
  selectMap?: {
    fromValue: (v: any) => string;      // form value -> <option> value
    toValue: (s: string) => any;        // <option> value -> form value
  };
};

export type StepDef<TForm> = {
  id: string;
  title: string;
  sub: string;
  fields: FieldDef<TForm>[];
};

// One row of the final answer sheet. `nr` = the official field number the
// government UI prints next to the input. `instruction: true` = a to-do
// ("tick the box", "leave empty"), rendered without a copy button.
export type AnswerRow = { nr: string; label: string; de: string; enHint: string; instruction?: boolean };
export type AnswerSection = { title: string; titleEn: string; rows: AnswerRow[] };
