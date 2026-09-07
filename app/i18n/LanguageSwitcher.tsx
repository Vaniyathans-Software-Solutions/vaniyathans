"use client";
import { usePathname } from "next/navigation";
import { useLocale } from "./LocaleProvider";
import { languageNames, languageEnglishNames, languageDirection, locales, localizePath, type Locale } from "./shared";
export default function LanguageSwitcher() {
  const pathname = usePathname();
  const { locale, t } = useLocale();
  return <label className="languageSwitcher"><span className="sr-only">{t("Language")}</span><select aria-label={t("Language")} value={locale} onChange={(event) => {
    // A full navigation also refreshes the document language and font stack.
    window.location.assign(localizePath(pathname, event.target.value as Locale) + window.location.search + window.location.hash);
  }}>{locales.map((value) => <option key={value} value={value} lang={value} dir={languageDirection(value)}>{languageNames[value]}{value === "en" ? "" : ` · ${languageEnglishNames[value]}`}</option>)}</select></label>;
}
