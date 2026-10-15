import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingPage from "../../LandingPage";
import AccountChoice from "../../signup/AccountChoice";
import SignupFlow from "../../signup/SignupFlow";
import SigninForm from "../../signin/SigninForm";
import Onboarding from "../../onboarding/page";
import ResetPassword from "../../reset-password/page";
import Workspace from "../../workspace/page";
import { isLocale, locales, localizePath } from "../../i18n/shared";
import { getTranslator } from "../../i18n/dictionaries.server";

type Props = {
  params: Promise<{ locale: string; path?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
const pages = ["", "signin", "signup", "signup/client", "signup/workforce", "workspace", "onboarding", "reset-password"];
async function route(params: Props["params"]) {
  const { locale, path = [] } = await params;
  const page = path.join("/");
  if (!isLocale(locale) || locale === "en" || !pages.includes(page)) notFound();
  return { locale, page };
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, page } = await route(params);
  const t = await getTranslator(locale);
  const label = page === "" ? "Open source. Product first. Made in Kerala." : page === "signin" ? "Sign in" : page === "workspace" ? "Vaniyathans workspace" : page === "signup/workforce" ? "Create workforce account" : page === "signup/client" ? "Create client account" : "Choose account type";
  const title = `${t(label)} | Vaniyathans`;
  const description = t(page === "" ? "Vaniyathans is an open source, product-first software company from Kerala. We build open source software that people can use, study, change, and share." : "Each account has its own shareable registration link. Both use the same secure sign-in and collaborate inside Workspace Studio.");
  const path = `/${page}`;
  return {
    title, description,
    alternates: { canonical: localizePath(path, locale), languages: { ...Object.fromEntries(locales.map(language => [language, localizePath(path, language)])), "x-default": path } },
    openGraph: { title, description, locale: `${locale}_IN`, url: localizePath(path, locale), images: page === "" ? [{ url: "/og-open-source.png", width: 1731, height: 909, alt: "Vaniyathans: Open Source. Product First. Made in Kerala." }] : [] },
    twitter: { card: page === "" ? "summary_large_image" : "summary", title, description, images: page === "" ? ["/og-open-source.png"] : [] },
    ...(page === "workspace" ? { robots: { index: false, follow: false } } : {}),
  };
}
export default async function LocalizedPage({ params, searchParams }: Props) {
  const { locale, page } = await route(params);
  if (page === "") return <LandingPage locale={locale} />;
  if (page === "signup") return <AccountChoice locale={locale} />;
  if (page === "signup/client") return <SignupFlow accountType="client" />;
  if (page === "signup/workforce") return <SignupFlow accountType="workforce" />;
  if (page === "onboarding") return <Onboarding searchParams={searchParams} />;
  if (page === "reset-password") return <ResetPassword searchParams={searchParams} />;
  if (page === "workspace") return <Workspace />;
  const query = await searchParams;
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  return <SigninForm initialEmail={first(query.email) ?? ""} created={first(query.created) === "1"} createdType={first(query.type) === "workforce" ? "workforce" : "client"} />;
}
