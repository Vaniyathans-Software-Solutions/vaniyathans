import type { Metadata } from "next";
import SignupFlow from "../SignupFlow";

export const metadata: Metadata = {
  title: "Client signup | Vaniyathans",
  description: "Create a Vaniyathans client account and turn your software idea into a structured delivery workspace.",
  openGraph: {
    title: "Start your software project with Vaniyathans",
    description: "Create a client account, share your first Epic, and enter Workspace Studio.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Start your software project with Vaniyathans",
    description: "Create a client account, share your first Epic, and enter Workspace Studio.",
    images: [],
  },
};

export default function ClientSignupPage() {
  return <SignupFlow accountType="client" />;
}
