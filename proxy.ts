import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "./app/i18n/languages";
export function proxy(request: NextRequest) {
  const segment = request.nextUrl.pathname.split("/")[1];
  const headers = new Headers(request.headers);
  headers.set("x-site-locale", isLocale(segment) ? segment : "en");
  return NextResponse.next({ request: { headers } });
}
export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
