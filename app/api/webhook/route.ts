/**
 * ExpatFlow — Stripe Webhook Handler
 * app/api/webhook/route.ts
 *
 * Listens for Stripe events. On checkout.session.completed:
 * - Logs the session ID and timestamp to console (visible in Vercel logs)
 * - This gives you a server-side record of every payment even if the
 *   user's browser crashes before reaching /success
 *
 * Setup in Stripe Dashboard:
 * 1. Go to dashboard.stripe.com → Developers → Webhooks
 * 2. Click "Add endpoint"
 * 3. URL: https://yoursite.vercel.app/api/webhook
 * 4. Select event: checkout.session.completed
 * 5. Copy the "Signing secret" (whsec_...)
 * 6. Add to Vercel env vars as: STRIPE_WEBHOOK_SECRET=whsec_...
 *
 * No personal data is stored — only session ID, amount, timestamp.
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Required: raw body for Stripe signature verification
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error("[ExpatFlow] Webhook: missing signature or secret");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("[ExpatFlow] Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle checkout completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Log to Vercel — visible in dashboard under Logs
    console.log("[ExpatFlow] Payment confirmed:", {
      sessionId: session.id,
      amount: session.amount_total, // in cents
      currency: session.currency,
      status: session.payment_status,
      created: new Date(session.created * 1000).toISOString(),
      // No personal data stored — we never receive form data
    });

    // Future: send email, update database, etc.
  }

  return NextResponse.json({ received: true });
}
