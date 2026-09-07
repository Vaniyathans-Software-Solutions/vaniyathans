import type { Metadata } from "next";
import { headers } from "next/headers";
import { LocaleProvider } from "./i18n/LocaleProvider";
import { isLocale, languageDirection } from "./i18n/languages";
import { getDictionary } from "./i18n/dictionaries.server";
import "./i18n/locale.css";
import "./i18n/fonts.css";
import "./i18n/additional-fonts.css";
import { Audiowide } from "next/font/google";
import "./globals.css";
import "./studio.css";

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-audiowide",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://vaniyathans.com"),
  title: "Vaniyathans | Build Your Brand, Software & AI Future",
  description: "From personal brand websites to custom software and intelligent AI agents, we build digital solutions that help you stand out, grow faster, and work smarter.",
  icons: { icon: "/vss-logo.png" },
  openGraph: {
    title: "Build Your Brand. Sell Your Vision. Automate Your Future.",
    description: "Personal brands, webshops, custom software, and intelligent AI agents — built by one technology partner.",
    images: [{ url: "/og-color.png", width: 1731, height: 909, alt: "Vaniyathans Software Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Your Brand. Sell Your Vision. Automate Your Future.",
    description: "Personal brands, webshops, custom software, and intelligent AI agents — built by one technology partner.",
    images: ["/og-color.png"],
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestedLocale = (await headers()).get("x-site-locale") ?? "en";
  const locale = isLocale(requestedLocale) ? requestedLocale : "en";
  const dictionary = await getDictionary(locale);
  return (
    <html lang={locale} dir={languageDirection(locale)} className={audiowide.variable}>
      <body className="min-h-full flex flex-col"><LocaleProvider locale={locale} dictionary={dictionary}>{children}</LocaleProvider></body>
    </html>
  );
}
