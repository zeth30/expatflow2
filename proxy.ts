import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GATE_COOKIE, GATE_HASH } from "./lib/preview";

// Personal-use Steuer page: without the password cookie, show the password form
// (same URL, the form posts to /api/steuer-login). See lib/preview.ts.
export function proxy(req: NextRequest) {
  if (req.cookies.get(GATE_COOKIE)?.value === GATE_HASH) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }
  const login = req.nextUrl.clone();
  login.pathname = "/steuer-login"; // keeps ?wrong=1
  return NextResponse.rewrite(login);
}

export const config = {
  matcher: ["/freelance-steuer/:path*"],
};
