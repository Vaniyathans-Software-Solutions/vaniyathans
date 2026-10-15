import type { Metadata } from "next";
import SignupFlow from "../SignupFlow";

export const metadata: Metadata = {
  title: "Workforce signup | Vaniyathans",
  description: "Bring your skills to open source product development with Vaniyathans, rooted in Kerala and open to the world.",
  openGraph: {
    title: "Build open source products with Vaniyathans",
    description: "Share your skills, interests, timezone, and availability for product collaboration.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Build open source products with Vaniyathans",
    description: "Share your skills, interests, timezone, and availability for product collaboration.",
    images: [],
  },
};

export default function WorkforceSignupPage() {
  return <SignupFlow accountType="workforce" />;
}
