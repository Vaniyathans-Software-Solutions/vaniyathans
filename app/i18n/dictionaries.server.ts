import { cache } from "react";
import { translator, type Dictionary, type Locale } from "./shared";

// Only register dictionaries that exist. Explicit imports let the bundler
// resolve each file while languages still being translated use English copy.
const dictionaryLoaders: Partial<Record<Locale, () => Promise<Dictionary>>> = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  hi: () => import("./dictionaries/hi.json").then((module) => module.default),
  ml: () => import("./dictionaries/ml.json").then((module) => module.default),
  ta: () => import("./dictionaries/ta.json").then((module) => module.default),
  // bn: () => import("./dictionaries/bn.json").then((module) => module.default),
};

export const getDictionary = cache(async (locale: Locale): Promise<Dictionary> => {
  const load = dictionaryLoaders[locale];
  return load ? load() : {};
});

export async function getTranslator(locale: Locale) {
  return translator(locale, await getDictionary(locale));
}
