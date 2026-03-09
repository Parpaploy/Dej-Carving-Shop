import th from "./locales/th";
import en from "./locales/en";
import type { TranslationKey } from "./locales/th";

export type Locale = "th" | "en";
export type { TranslationKey };

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  th,
  en,
};
