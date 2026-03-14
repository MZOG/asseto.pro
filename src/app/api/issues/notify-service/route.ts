import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { to, subject, message } = await request.json();

  if (!to || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Asseto <powiadomienia@asseto.pro>",
    to,
    subject: subject ?? "Zgłoszenie usterki — Asseto",
    html: `
      <div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #111;">
        <div style="margin-bottom: 24px;">
          <span style="background: #fefce8; color: #ca8a04; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 99px; letter-spacing: 0.05em; text-transform: uppercase;">
            Zgłoszenie serwisowe
          </span>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; white-space: pre-line; font-size: 15px; line-height: 1.6; color: #111;">
          ${message.replace(/\n/g, "<br/>")}
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          Asseto · System zarządzania awariami
        </p>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
