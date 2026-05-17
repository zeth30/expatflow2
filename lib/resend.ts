/**
 * SimplyExpat — Resend Email Service (Option A — Reminder Only)
 * lib/resend.ts
 *
 * Legal basis: Art. 6(1)(a) DSGVO — freely given consent via email field.
 * No PDF attachments. No special-category data (Art. 9) transmitted.
 * Only data sent to Resend: email address + first name + sheet count.
 * All personal form data remains exclusively in the user's browser.
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Update to your verified domain. Use "onboarding@resend.dev" for local testing.
const FROM = "SimplyExpat Berlin <info@simplyexpat.de>";

export interface SendReminderEmailParams {
  to: string;
  firstName: string;
  sheets: number;
}

function buildReminderHtml(firstName: string, sheets: number): string {
  const steps = [
    ["1", "Print your Anmeldung", "Germany requires paper. DM or Rossmann have self-service kiosks — ~€0.10 per page."],
    ["2", "Book your Bürgeramt appointment", "Go to service.berlin.de — any of the 44 Berlin locations."],
    ["3", "Bring your checklist items", "Everything you need is listed in your personalised Checklist PDF."],
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Your Bürgeramt appointment — next steps</title></head>
<body style="margin:0;padding:0;background:#f8f9fb;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fb;padding:40px 16px;">
<tr><td align="center">
<table width="100%" style="max-width:540px;">

  <tr><td style="padding-bottom:20px;" align="center">
    <span style="font-size:15px;font-weight:800;color:#0f172a;">SimplyExpat </span>
    <span style="font-size:15px;font-weight:800;color:#0075FF;">Berlin</span>
  </td></tr>

  <tr><td style="background:white;border-radius:20px;border:1px solid #e8ecf4;box-shadow:0 4px 24px rgba(0,0,0,0.06);overflow:hidden;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="background:linear-gradient(135deg,#0f172a,#0075FF);padding:28px 32px 24px;border-radius:20px 20px 0 0;">
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:rgba(191,219,254,0.8);letter-spacing:0.1em;text-transform:uppercase;">Documents ready</p>
        <h1 style="margin:0;font-size:22px;font-weight:900;color:white;line-height:1.2;letter-spacing:-0.02em;">
          Almost there, ${firstName}.<br/>One thing left to do.
        </h1>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:24px 32px;">
        <p style="margin:0 0 20px;font-size:14.5px;color:#374151;line-height:1.7;">
          Your ${sheets > 1 ? `${sheets} Anmeldung forms` : "Anmeldung form"} and personalised checklist are ready in your browser.
          The only thing left is booking your Bürgeramt appointment.
        </p>

        ${steps.map(([n, title, desc]) => `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
          <tr>
            <td width="30" valign="top">
              <div style="width:22px;height:22px;background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:6px;text-align:center;line-height:22px;font-size:10px;font-weight:800;color:#0075FF;">${n}</div>
            </td>
            <td style="padding-left:10px;">
              <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#0f172a;">${title}</p>
              <p style="margin:0;font-size:12px;color:#64748b;line-height:1.5;">${desc}</p>
            </td>
          </tr>
        </table>`).join("")}

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
          <tr><td align="center">
            <a href="https://service.berlin.de/dienstleistung/120686/"
               style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#0f172a,#0075FF);color:white;font-size:13.5px;font-weight:800;text-decoration:none;border-radius:11px;">
              Book Bürgeramt Appointment →
            </a>
          </td></tr>
        </table>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="background:#f8fafc;border-top:1px solid #e8ecf4;padding:14px 32px;border-radius:0 0 20px 20px;">
        <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
          🔒 Your documents were generated in your browser. We never received your address, passport details, or any other personal data. Only your first name and email address were used to send this message.
        </p>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:20px 0 0;" align="center">
    <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
      SimplyExpat Berlin · info@simplyexpat.de<br/>
      You received this because you entered your email at checkout.<br/>
      <a href="https://simplyexpat.de/privacy" style="color:#94a3b8;">Privacy Policy</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function sendReminderEmail({
  to,
  firstName,
  sheets,
}: SendReminderEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject: `Your Bürgeramt appointment — next steps, ${firstName}`,
      html: buildReminderHtml(firstName, sheets),
      // No attachments — Option A: zero sensitive data transmitted
    });

    if (error) {
      console.error("[SimplyExpat] Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log("[SimplyExpat] Reminder sent:", data?.id);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message ?? "Unknown error" };
  }
}
