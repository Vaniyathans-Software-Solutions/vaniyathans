"use client";
import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { localizePath, translator, type Dictionary, type Locale } from "./shared";

const LocaleContext = createContext<{ locale: Locale; dictionary: Dictionary }>({ locale: "en", dictionary: {} });
export function LocaleProvider({ locale, dictionary, children }: { locale: Locale; dictionary: Dictionary; children: React.ReactNode }) {
  return <LocaleContext.Provider value={{ locale, dictionary }}>{children}</LocaleContext.Provider>;
}
export function useLocale() { const { locale, dictionary } = useContext(LocaleContext); return { locale, t: translator(locale, dictionary) }; }
export function useLocalizedRouter() {
  const router = useRouter();
  const { locale } = useLocale();
  return { ...router, push: (href: string) => router.push(localizePath(href, locale)), replace: (href: string) => router.replace(localizePath(href, locale)) };
}
