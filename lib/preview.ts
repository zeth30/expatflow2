/**
 * Owner access for the unlaunched Steuer product.
 *
 * The pages are public (free beta). Opening them once with ?key=<STEUER_PREVIEW_KEY>
 * (or via the hidden button bottom right on /freelance-steuer) sets an httpOnly cookie;
 * only that browser can start the paid Steuer checkout.
 */
import type { NextRequest } from "next/server";

export const PREVIEW_COOKIE = "rx_preview";
export const OWNER_FLAG_COOKIE = "rx_owner";

export function previewKey(): string | undefined {
  return process.env.STEUER_PREVIEW_KEY || undefined;
}

export function hasPreviewAccess(req: NextRequest): boolean {
  const key = previewKey();
  return !!key && req.cookies.get(PREVIEW_COOKIE)?.value === key;
}
