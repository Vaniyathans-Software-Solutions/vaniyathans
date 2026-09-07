import { isLocale, type Locale } from "./languages";
export { locales, languageNames, languageEnglishNames, isLocale, languageDirection, type Locale } from "./languages";

export function localizePath(path: string, locale: Locale) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const stripped = path.replace(/^\/([^/?#]+)(?=\/|\?|#|$)/, (prefix, segment) => isLocale(segment) ? "" : prefix) || "/";
  const clean = stripped.startsWith("/") ? stripped : `/${stripped}`;
  return locale === "en" ? clean : `/${locale}${clean === "/" ? "" : clean}`;
}
export type Dictionary = Record<string, string>;
export function translator(locale: Locale, dictionary: Dictionary = {}) {
  return (text: string, values: Record<string, string | number> = {}) => {
    const key = text.replace(/\s+/g, " ").trim();
    const translated = dictionary[key] ?? key;
    return translated.replace(/\{(\w+)\}/g, (match, name) => String(values[name] ?? match));
  };
}
