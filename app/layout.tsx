import type { Metadata } from "next";
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={audiowide.variable}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
