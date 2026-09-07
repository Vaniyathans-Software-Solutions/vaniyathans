"use client";

import Image from "next/image";
import hindiLogo from "../public/vaniyathans-logo-hi.png";
import { type Locale } from "./i18n/shared";
import { useLocale } from "./i18n/LocaleProvider";

export default function BrandLogo({ locale, className, preload = false }: { locale: Locale; className?: string; preload?: boolean }) {
  const { t } = useLocale();
  const localized = locale === "ml" || locale === "hi";
  return (
    <Image
      className={className}
      src={locale === "hi" ? hindiLogo : locale === "ml" ? "/vaniyathans-logo-ml.png" : "/vaniyathans-logo-2026.png"}
      alt={t("Vaniyathans Software Solutions")}
      width={localized ? 1983 : 1984}
      height={793}
      preload={preload}
    />
  );
}
