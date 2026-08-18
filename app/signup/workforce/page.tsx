import type { Metadata } from "next";
import SignupFlow from "../SignupFlow";

export const metadata: Metadata = {
  title: "Workforce signup | Vaniyathans",
  description: "Create a Vaniyathans workforce account and join a global 24/7 software delivery team.",
  openGraph: {
    title: "Join the Vaniyathans global workforce",
    description: "Register your skills, delivery role, timezone, and availability.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Join the Vaniyathans global workforce",
    description: "Register your skills, delivery role, timezone, and availability.",
    images: [],
  },
};

export default function WorkforceSignupPage() {
  return <SignupFlow accountType="workforce" />;
}
