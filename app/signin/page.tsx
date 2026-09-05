import type { Metadata } from "next";
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

export default async function SigninPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

  return <SigninForm initialEmail={first(params.email) ?? ""} created={first(params.created) === "1"} createdType={first(params.type) === "workforce" ? "workforce" : "client"} />;
}
