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
  description: "Vaniyathans Software Solutions designs and builds high-performance digital products, intelligent platforms, and scalable technology systems.",
  icons: { icon: "/vss-logo.png" },
  openGraph: {
    title: "Vaniyathans Software Solutions",
    description: "Engineering digital momentum.",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Vaniyathans Software Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaniyathans Software Solutions",
    description: "Engineering digital momentum.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={audiowide.variable}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
