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
  title: "Vaniyathans | Open Source Products from Kerala",
  description: "An open source, product-first software company from Thiruvananthapuram, Kerala. Building open source software to use, study, change, and share. Explore www.software-system.design.",
  icons: { icon: "/vss-logo.png" },
  openGraph: {
    title: "Vaniyathans | Open Source Products from Kerala",
    description: "Open source software, shared knowledge, and useful open source products. Rooted in Kerala, open to the world.",
    images: [{ url: "/og-open-source.png", width: 1731, height: 909, alt: "Vaniyathans: Open Source. Product First. Made in Kerala." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaniyathans | Open Source Products from Kerala",
    description: "Open source software, shared knowledge, and useful open source products. Rooted in Kerala, open to the world.",
    images: ["/og-open-source.png"],
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
