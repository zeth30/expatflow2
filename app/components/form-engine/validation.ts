import type { StepDef } from "./types";

// Generic required-field check for one wizard step. Returns the first
// missing-field message or "". `false` counts as answered (booleans are
// null until the user actively chooses — a pre-selected "No" on a
// government form is a silent wrong answer).
export function requiredError<TForm>(steps: StepDef<TForm>[], stepId: string, f: TForm, t: (s: string) => string = s => s): string {
  const step = steps.find(s => s.id === stepId);
  if (!step || (step.showIf && !step.showIf(f))) return "";
  for (const fd of step.fields) {
    if (fd.showIf && !fd.showIf(f)) continue;
    const req = typeof fd.required === "function" ? fd.required(f) : fd.required;
    const val = f[fd.key];
    if (req && (val === "" || val === null || val === undefined)) {
      return `${t("Please fill in:")} ${t(fd.label)}`;
    }
  }
  return "";
}
