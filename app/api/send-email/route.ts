/**
 * ExpatFlow — Email API Route (Option A — Reminder Only)
 * app/api/send-email/route.ts
 *
 * POST /api/send-email
 *
 * Accepts:  { to: string, firstName: string, sheets: number }
 * Returns:  200 { success: true } | 400/500 { error: string }
 *
 * Legal basis: Art. 6(1)(a) DSGVO.
 * No PDF bytes. No passport data. No special-category data (Art. 9).
 * Only first name + email + sheet count pass through this server.
 * Nothing is logged or persisted.
 */

import { NextRequest, NextResponse } from "next/server";
import { sendReminderEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, firstName, sheets } = body;

    // Validate — minimal data only
    if (!to || typeof to !== "string" || !to.includes("@")) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (!process.env.RESEND_API_KEY) {
      console.error("[ExpatFlow] RESEND_API_KEY not set.");
      return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
    }

    const result = await sendReminderEmail({
      to,
      firstName: typeof firstName === "string" ? firstName : "there",
      sheets: Number(sheets) || 1,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error ?? "Send failed." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[ExpatFlow] /api/send-email error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
