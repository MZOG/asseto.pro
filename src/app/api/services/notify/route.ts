// src/app/api/services/notify/route.ts
// Wywoływany przez cron job (np. Vercel Cron) codziennie rano
// Sprawdza serwisy zbliżające się w ciągu X dni i wysyła e-mail

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  // Zabezpieczenie — tylko z cron secret
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // Pobierz wszystkich Pro userów z reminder_days
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, company_name, service_reminder_days")
    .eq("plan", "pro");

  if (!profiles?.length) return NextResponse.json({ sent: 0 });

  let sent = 0;

  for (const profile of profiles) {
    const reminderDays = profile.service_reminder_days ?? 7;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + reminderDays);
    const targetDateStr = targetDate.toISOString().split("T")[0];

    // Znajdź serwisy zaplanowane na dokładnie ten dzień
    const { data: services } = await supabase
      .from("services")
      .select(
        "id, next_service_at, asset_id, assets!inner(name, location, owner_id)",
      )
      .eq("next_service_at", targetDateStr)
      .eq("assets.owner_id", profile.id);

    if (!services?.length) continue;

    const rows = services
      .map(
        (s: any) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #111;">${s.assets.name}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #6b7280;">${s.assets.location ?? "—"}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; font-weight: 600; color: #2563eb;">${new Date(s.next_service_at).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}</td>
      </tr>
    `,
      )
      .join("");

    await resend.emails.send({
      from: "Asseto <powiadomienia@asseto.pro>",
      to: profile.email,
      subject: `🔧 Przypomnienie o serwisie — ${services.length} ${services.length === 1 ? "urządzenie" : "urządzenia"}`,
      html: `
        <div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #111;">
          <div style="margin-bottom: 24px;">
            <span style="background: #fef3c7; color: #d97706; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.05em;">
              Przypomnienie o serwisie
            </span>
          </div>

          <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 8px;">
            Zbliżający się termin serwisu
          </h1>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px;">
            ${profile.company_name ?? "Twoja firma"} · Za ${reminderDays} ${reminderDays === 1 ? "dzień" : "dni"}
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 8px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; font-weight: 600;">Urządzenie</th>
                <th style="padding: 8px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; font-weight: 600;">Lokalizacja</th>
                <th style="padding: 8px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; font-weight: 600;">Data serwisu</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/panel/serwisy"
            style="display: inline-block; background: #2563eb; color: white; font-size: 14px; font-weight: 600; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
            Przejdź do serwisów →
          </a>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            Asseto · Możesz zmienić ilość dni przypomnienia w ustawieniach konta.
          </p>
        </div>
      `,
    });

    sent++;
  }

  return NextResponse.json({ sent });
}
