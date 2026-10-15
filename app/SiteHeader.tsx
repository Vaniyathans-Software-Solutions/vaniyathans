"use client";

import ArrowIcon from "@/app/ArrowIcon";
import BrandLogo from "./BrandLogo";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import Link from "./i18n/LocalizedLink";
import { useLocale } from "./i18n/LocaleProvider";

export type NavigationSection = "expertise" | "method" | "journey";

type SiteHeaderProps = {
  activeSection: NavigationSection | null;
  onSelectSection: (section: NavigationSection) => void;
};

export default function SiteHeader({ activeSection, onSelectSection }: SiteHeaderProps) {
  const { t, locale } = useLocale();
  const sectionLink = (section: NavigationSection, label: string) => (
    <a
      className="mainNavSection"
      href={`#${section}`}
      aria-current={activeSection === section ? "location" : undefined}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        onSelectSection(section);
        event.currentTarget.closest("details")?.removeAttribute("open");
      }}
    >{t(label)}</a>
  );

  return (
    <header className="siteHeader">
        <a className="brand" href="#top" aria-label={t("Vaniyathans home")}>
          <BrandLogo
            className="brandLogo"
            locale={locale}
            preload
          />
        </a>

        <nav className="mainNav" aria-label={t("Main navigation")}>
          <LanguageSwitcher />
          {sectionLink("expertise", "Products")}
          {sectionLink("method", "Build openly")}
          {sectionLink("journey", "Product journey")}
          <Link className="signInLink" href="/signin">{t("Sign in")}</Link>
          <Link className="navCta" href="/signup">{t("Join us")} <ArrowIcon direction="up-right" /></Link>
          <details className="mobileMenu">
            <summary aria-label={t("Open navigation menu")}>☰</summary>
            <nav aria-label={t("Mobile navigation")}>
              <LanguageSwitcher />
              {sectionLink("expertise", "Products")}
              {sectionLink("method", "Build openly")}
              {sectionLink("journey", "Product journey")}
              <Link href="/signin">{t("Sign in")}</Link>
            </nav>
          </details>
        </nav>
      </header>
  );
}
