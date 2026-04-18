/**
 * ExpatFlow — Stripe Session Verification
 * app/api/verify-session/route.ts
 *
 * POST /api/verify-session
 * Body: { sessionId: string }
 * Returns: { paid: boolean }
 *
 * Called by /success page before showing download buttons.
 * No personal data is stored or logged.
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ paid: false }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const paid =
      session.payment_status === "paid" &&
      session.status === "complete";

    return NextResponse.json({ paid });
  } catch (err: any) {
    console.error("[ExpatFlow] verify-session error:", err?.message);
    return NextResponse.json({ paid: false }, { status: 500 });
  }
}
