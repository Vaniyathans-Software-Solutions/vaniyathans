import type { Metadata } from "next";
import AccountChoice from "./AccountChoice";

export const metadata: Metadata = {
  title: "Create an account | Vaniyathans",
  description: "Choose a dedicated Vaniyathans account for starting a software project or joining the global workforce.",
  openGraph: {
    title: "Choose your Vaniyathans account",
    description: "Create a client account or join the Vaniyathans global workforce.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Choose your Vaniyathans account",
    description: "Create a client account or join the Vaniyathans global workforce.",
    images: [],
  },
};

export default function SignupPage() { return <AccountChoice />; }
