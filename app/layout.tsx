import type { Metadata } from "next";
import { Audiowide } from "next/font/google";
import "./globals.css";

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-audiowide",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://vaniyathans.com"),
  title: "Vaniyathans Software Solutions | Digital Product Engineering",
  description: "The world's first software company built to deliver software within 8 hours, powered by a 24/7 workforce.",
  icons: { icon: "/vss-logo.png" },
  openGraph: {
    title: "Vaniyathans Software Solutions",
    description: "Software delivered within 8 hours. Powered by a 24/7 workforce.",
    images: [{ url: "/og-color.png", width: 1731, height: 909, alt: "Vaniyathans Software Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaniyathans Software Solutions",
    description: "Software delivered within 8 hours. Powered by a 24/7 workforce.",
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
