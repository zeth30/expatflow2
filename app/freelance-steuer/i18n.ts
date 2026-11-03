// EN/DE switch for the Steuer wizard. Static field copy (labels, explain,
// more, options) is translated by dictionary (steuer-de.json, keyed by the
// English text); dynamic copy (tips, suggestions) is written bilingually
// with L(en, de). Language is set by the page before each render.
import DE from "./steuer-de.json";

export type Lang = "en" | "de";
export const LANG_KEY = "simplyexpat-steuer-lang";

let lang: Lang = "en";
export const setLang = (l: Lang) => { lang = l; };
export const getLang = () => lang;

const dict = DE as Record<string, string>;
export const tr = (en: string) => (lang === "de" && en ? dict[en] ?? en : en);
export const hasTr = (en: string) => lang !== "de" || !!dict[en];
export function L<T>(en: T, de: T): T { return lang === "de" ? de : en; }
