/**
 * SimplyExpat — Waitlist Subscribe
 * app/api/subscribe/route.ts
 *
 * POST /api/subscribe
 * Body: { email: string }
 *
 * Adds the email to the Resend audience specified by RESEND_AUDIENCE_ID.
 * No personal data beyond the email address is stored.
 *
 * Setup required:
 *   1. In the Resend dashboard create an Audience (Audiences → New Audience)
 *   2. Copy the audience ID and add it as RESEND_AUDIENCE_ID in Vercel env vars
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.contacts.create({
      email: email.trim().toLowerCase(),
      unsubscribed: false,
    });

    if (error) {
      console.error("[SimplyExpat] Resend contacts error:", error);
      return NextResponse.json({ error: "Could not add to list." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[SimplyExpat] /api/subscribe error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
