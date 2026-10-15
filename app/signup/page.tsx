import type { Metadata } from "next";
import AccountChoice from "./AccountChoice";

export const metadata: Metadata = {
  title: "Create an account | Vaniyathans",
  description: "Collaborate on open source products or bring your skills to open source software development with Vaniyathans, Kerala.",
  openGraph: {
    title: "Choose your Vaniyathans account",
    description: "Join Vaniyathans to collaborate on products and build open source software together.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Choose your Vaniyathans account",
    description: "Join Vaniyathans to collaborate on products and build open source software together.",
    images: [],
  },
};

export default function SignupPage() { return <AccountChoice />; }
