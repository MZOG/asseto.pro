import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  await resend.emails.send({
    from: "Asseto <powiadomienia@asseto.pro>",
    to: "marcin@asseto.pro",
    subject: "🎉 Nowy użytkownik — Asseto",
    html: `
      <div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #111;">
        <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 16px;">Nowa rejestracja</h2>
        <p style="font-size: 15px; color: #374151; margin: 0 0 8px;">
          Nowy użytkownik zarejestrował się w Asseto.
        </p>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin-top: 16px;">
          <p style="font-size: 13px; color: #6b7280; margin: 0 0 4px;">Adres e-mail</p>
          <p style="font-size: 15px; font-weight: 600; color: #111; margin: 0;">${email}</p>
        </div>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 32px;">Asseto · System zarządzania awariami</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
