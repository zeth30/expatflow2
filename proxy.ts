import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PREVIEW_COOKIE, hasPreviewAccess, previewKey } from "./lib/preview";

// Locks the unlaunched Steuer pages behind a private link (see lib/preview.ts).
export function proxy(req: NextRequest) {
  const key = previewKey();
  const given = req.nextUrl.searchParams.get("key");

  // First visit via the private link: remember access, then drop the key from the URL
  if (key && given === key) {
    const clean = req.nextUrl.clone();
    clean.searchParams.delete("key");
    const res = NextResponse.redirect(clean);
    res.cookies.set(PREVIEW_COOKIE, key, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  }

  if (hasPreviewAccess(req)) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  // Unknown path → Next.js renders the normal 404 page with status 404
  return NextResponse.rewrite(new URL("/__locked", req.url));
}

export const config = {
  matcher: ["/freelance-steuer/:path*", "/elster-account-english/:path*"],
};
