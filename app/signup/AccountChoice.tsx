import LanguageSwitcher from "@/app/i18n/LanguageSwitcher";
import Link from "@/app/i18n/LocalizedLink";
import BrandLogo from "@/app/BrandLogo";
import { type Locale } from "../i18n/shared";
import { getTranslator } from "../i18n/dictionaries.server";

export default async function AccountChoice({ locale = "en" }: { locale?: Locale }) {
  const t = await getTranslator(locale);
  return (
    <main className="accountChoicePage">
      <header className="accountChoiceHeader">
        <LanguageSwitcher />
        <Link className="authLogo" href="/" aria-label={t("Vaniyathans home")}>
          <BrandLogo locale={locale} preload />
        </Link>
        <Link href="/signin">{t("Already registered?")} <strong>{t("Sign in →")}</strong></Link>
      </header>

      <section className="accountChoiceIntro" aria-labelledby="account-choice-title">
        <p className="authEyebrow"><span /> {t("TWO JOURNEYS · ONE DELIVERY STUDIO")}</p>
        <h1 id="account-choice-title">{t("Choose how you want")}<br /><em>{t("to build with us.")}</em></h1>
        <p>{t("Each account has its own shareable registration link. Both use the same secure sign-in and collaborate inside Workspace Studio.")}</p>
      </section>

      <section className="accountChoiceGrid" aria-label={t("Account types")}>
        <article className="accountChoiceCard clientChoice">
          <div className="accountChoiceIcon" aria-hidden="true">◎</div>
          <span>{t("CLIENT ACCOUNT")}</span>
          <h2>{t("Start a software project")}</h2>
          <p>{t("Share your vision, frame the first Epic, and follow delivery from backlog to deployment.")}</p>
          <ul><li>{t("Project intake and workspace setup")}</li><li>{t("Live Kanban, backlog, and analytics")}</li><li>{t("Direct visibility into delivery")}</li></ul>
          <Link href="/signup/client">{t("Create client account")} <span>→</span></Link>
        </article>

        <article className="accountChoiceCard workforceChoice">
          <div className="accountChoiceIcon" aria-hidden="true">⌘</div>
          <span>{t("WORKFORCE ACCOUNT")}</span>
          <h2>{t("Join the delivery workforce")}</h2>
          <p>{t("Register your expertise, availability, and timezone to work on structured product delivery.")}</p>
          <ul><li>{t("Skills and experience profile")}</li><li>{t("Assigned work and project context")}</li><li>{t("Epic-to-subtask collaboration")}</li></ul>
          <Link href="/signup/workforce">{t("Create workforce account")} <span>→</span></Link>
        </article>
      </section>

      <footer className="accountChoiceFooter">{t("Need help choosing?")} <a href="mailto:support@vaniyathans.com">{t("support@vaniyathans.com")}</a></footer>
    </main>
  );
}
