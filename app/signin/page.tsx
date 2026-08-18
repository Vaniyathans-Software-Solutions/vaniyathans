import type { Metadata } from "next";
import { Suspense } from "react";
import SigninForm from "./SigninForm";

export const metadata: Metadata = {
  title: "Sign in | Vaniyathans Workspace Studio",
  description: "One secure sign-in for Vaniyathans clients and workforce members.",
  openGraph: {
    title: "Sign in to Vaniyathans Workspace Studio",
    description: "Access your client or workforce account with email or mobile OTP.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Sign in to Vaniyathans Workspace Studio",
    description: "Access your client or workforce account with email or mobile OTP.",
    images: [],
  },
};

export default function SigninPage() {
  return <Suspense fallback={<main className="authLoading">Opening secure access…</main>}><SigninForm /></Suspense>;
}
