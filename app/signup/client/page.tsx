import type { Metadata } from "next";
import SignupFlow from "../SignupFlow";

export const metadata: Metadata = {
  title: "Client signup | Vaniyathans",
  description: "Bring a product idea or shared problem to Vaniyathans, an open source software company from Kerala.",
  openGraph: {
    title: "Collaborate on a product with Vaniyathans",
    description: "Create a collaboration account and shape a useful product in Workspace Studio.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Collaborate on a product with Vaniyathans",
    description: "Create a collaboration account and shape a useful product in Workspace Studio.",
    images: [],
  },
};

export default function ClientSignupPage() {
  return <SignupFlow accountType="client" />;
}
