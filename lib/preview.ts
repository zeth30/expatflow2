/**
 * Private preview gate for unlaunched products (currently: Steuer).
 *
 * Open once with ?key=<STEUER_PREVIEW_KEY> → an httpOnly cookie is set and the
 * pages stay reachable in that browser. Everyone else gets a 404.
 * If STEUER_PREVIEW_KEY is not set, the pages are locked for everyone.
 */
import type { NextRequest } from "next/server";

export const PREVIEW_COOKIE = "rx_preview";

export const PREVIEW_PATHS = ["/freelance-steuer", "/elster-account-english"];

export function previewKey(): string | undefined {
  return process.env.STEUER_PREVIEW_KEY || undefined;
}

export function hasPreviewAccess(req: NextRequest): boolean {
  const key = previewKey();
  return !!key && req.cookies.get(PREVIEW_COOKIE)?.value === key;
}
