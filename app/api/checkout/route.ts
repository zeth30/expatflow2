/**
 * ExpatFlow — Stripe Checkout Session
 * app/api/checkout/route.ts
 *
 * POST /api/checkout
 * Creates a one-time Stripe Checkout session for €15.
 * Returns { url } — frontend redirects to Stripe hosted page.
 *
 * Environment variables required:
 *   STRIPE_SECRET_KEY      — sk_live_... or sk_test_...
 *   NEXT_PUBLIC_DOMAIN     — https://expatflow.de (no trailing slash)
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const domain = process.env.NEXT_PUBLIC_DOMAIN ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: 1500, // €15.00 in cents
            product_data: {
              name: "ExpatFlow Berlin — Anmeldung Preparation",
              description:
                "Official Anmeldung form (all 54 fields filled), personalised checklist, and expert appointment guide. One-time digital service.",
              images: [`${domain}/og-image.png`],
            },
          },
          quantity: 1,
        },
      ],
      // IMPORTANT: session_id in success_url is how we verify payment
      success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/#payment`,
      // Metadata — not personal data, just for Stripe dashboard
      metadata: {
        service: "anmeldung-preparation",
        version: "1.0",
      },
      // No customer creation — we don't store anything
      customer_creation: "if_required",
      // Consent for digital services (§356 BGB / EU Directive 2011/83)
      consent_collection: {
        terms_of_service: "required",
      },
      custom_text: {
        terms_of_service_acceptance: {
          message:
            "I agree to the [Terms of Service](https://expatflow.de/terms) and acknowledge that PDF generation begins immediately after payment, waiving my right of withdrawal under §356 BGB.",
        },
        submit: {
          message:
            "Your form data never leaves your browser. We only receive payment confirmation.",
        },
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[ExpatFlow] Stripe checkout error:", err?.message);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error." },
      { status: 500 }
    );
  }
}
