import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { GATE_COOKIE, GATE_HASH, GATE_PATH } from "@/lib/preview";

// Checks the password from the /steuer-login form and sets the gate cookie.
export async function POST(req: NextRequest) {
  const data = await req.formData();
  const pw = String(data.get("password") ?? "");
  const ok = createHash("sha256").update(pw).digest("hex") === GATE_HASH;
  const res = NextResponse.redirect(new URL(ok ? GATE_PATH : `${GATE_PATH}?wrong=1`, req.url), 303);
  if (ok) {
    res.cookies.set(GATE_COOKIE, GATE_HASH, {
      httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365,
    });
  }
  return res;
}
