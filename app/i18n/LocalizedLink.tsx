"use client";
import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "./LocaleProvider";
import { localizePath } from "./shared";
export default function LocalizedLink(props: ComponentProps<typeof Link>) {
  const { locale } = useLocale();
  return <Link {...props} href={typeof props.href === "string" ? localizePath(props.href, locale) : props.href} />;
}
