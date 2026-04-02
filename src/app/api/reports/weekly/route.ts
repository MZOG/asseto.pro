// src/app/api/reports/weekly/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString();
  const weekAgoDate = weekAgo.toISOString().split("T")[0];

  const today = new Date();
  const in30Days = new Date();
  in30Days.setDate(today.getDate() + 30);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, company_name, report_issues, report_services")
    .eq("plan", "pro")
    .or("report_issues.eq.true,report_services.eq.true");

  if (!profiles?.length) return NextResponse.json({ sent: 0 });

  let sent = 0;

  for (const profile of profiles) {
    let issuesHtml = "";
    let servicesHtml = "";

    if (profile.report_issues) {
      const { data: issues } = await supabase
        .from("issues")
        .select("id, status, created_at, assets!inner(name, owner_id)")
        .eq("assets.owner_id", profile.id)
        .gte("created_at", weekAgoStr)
        .order("created_at", { ascending: false });

      if (issues?.length) {
        const statusLabel: Record<string, string> = {
          broken: "Uszkodzona",
          maintenance: "W serwisie",
          closed: "Zamknięta",
        };
        const statusColor: Record<string, string> = {
          broken: "#fee2e2",
          maintenance: "#fef3c7",
          closed: "#f3f4f6",
        };

        const rows = issues
          .map(
            (i: any) => `
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111;">${(i.assets as any).name}</td>

            <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;">
              <span style="background:${statusColor[i.status] ?? "#f3f4f6"};padding:2px 8px;border-radius:99px;font-size:11px;font-weight:600;">
                ${statusLabel[i.status] ?? i.status}
              </span>
            </td>
            <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;">${new Date(i.created_at).toLocaleDateString("pl-PL")}</td>
          </tr>
        `,
          )
          .join("");

        issuesHtml = `
          <div style="margin-bottom:32px;">
            <h2 style="font-size:16px;font-weight:600;margin:0 0 4px;">Awarie</h2>
            <p style="font-size:13px;color:#6b7280;margin:0 0 16px;">${issues.length} zgłoszeń w ostatnim tygodniu</p>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#f9fafb;">
                  <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;">Maszyna</th>
                  <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;">Status</th>
                  <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;">Data</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        `;
      } else {
        issuesHtml = `
          <div style="margin-bottom:32px;">
            <h2 style="font-size:16px;font-weight:600;margin:0 0 4px;">Awarie</h2>
            <p style="font-size:13px;color:#6b7280;margin:0;">Brak awarii w ostatnim tygodniu. 🎉</p>
          </div>
        `;
      }
    }

    // ── Serwisy ──────────────────────────────────────────
    if (profile.report_services) {
      const { data: recentServices } = await supabase
        .from("services")
        .select(
          "id, serviced_at, type, performed_by, assets!inner(name, owner_id)",
        )
        .eq("assets.owner_id", profile.id)
        .gte("serviced_at", weekAgoDate)
        .order("serviced_at", { ascending: false });

      const { data: upcomingServices } = await supabase
        .from("services")
        .select("id, next_service_at, assets!inner(name, owner_id)")
        .eq("assets.owner_id", profile.id)
        .gte("next_service_at", today.toISOString().split("T")[0])
        .lte("next_service_at", in30Days.toISOString().split("T")[0])
        .order("next_service_at", { ascending: true });

      const typeLabel: Record<string, string> = {
        inspection: "Przegląd",
        repair: "Naprawa",
        replacement: "Wymiana",
      };

      const recentRows = (recentServices ?? [])
        .map(
          (s: any) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111;">${(s.assets as any).name}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#6b7280;">${typeLabel[s.type] ?? s.type}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#6b7280;">${s.performed_by ?? "—"}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;font-size:12px;color:#9ca3af;">${new Date(s.serviced_at).toLocaleDateString("pl-PL")}</td>
        </tr>
      `,
        )
        .join("");

      const upcomingRows = (upcomingServices ?? [])
        .map(
          (s: any) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#111;">${(s.assets as any).name}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;font-size:13px;font-weight:600;color:#d97706;">${new Date(s.next_service_at).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}</td>
        </tr>
      `,
        )
        .join("");

      servicesHtml = `
        <div style="margin-bottom:32px;">
          <h2 style="font-size:16px;font-weight:600;margin:0 0 16px;">Serwisy</h2>

          ${
            recentRows
              ? `
            <p style="font-size:13px;color:#6b7280;margin:0 0 10px;">Wykonane w ostatnim tygodniu:</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <thead>
                <tr style="background:#f9fafb;">
                  <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;">Maszyna</th>
                  <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;">Typ</th>
                  <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;">Wykonał</th>
                  <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;">Data</th>
                </tr>
              </thead>
              <tbody>${recentRows}</tbody>
            </table>
          `
              : '<p style="font-size:13px;color:#6b7280;margin:0 0 20px;">Brak serwisów w ostatnim tygodniu.</p>'
          }

          ${
            upcomingRows
              ? `
            <p style="font-size:13px;color:#6b7280;margin:0 0 10px;">Zbliżające się serwisy (30 dni):</p>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#fef3c7;">
                  <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#92400e;">Maszyna</th>
                  <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#92400e;">Termin</th>
                </tr>
              </thead>
              <tbody>${upcomingRows}</tbody>
            </table>
          `
              : ""
          }
        </div>
      `;
    }

    if (!issuesHtml && !servicesHtml) continue;

    const weekStart = weekAgo.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "long",
    });
    const weekEnd = today.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    await resend.emails.send({
      from: "Asseto <powiadomienia@asseto.pro>",
      to: profile.email,
      subject: `📊 Raport tygodniowy — ${weekStart}–${weekEnd}`,
      html: `
        <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#111;">
          <div style="margin-bottom:24px;">
            <span style="background:#eff6ff;color:#2563eb;font-size:12px;font-weight:600;padding:4px 10px;border-radius:99px;text-transform:uppercase;letter-spacing:.05em;">
              Raport tygodniowy
            </span>
          </div>

          <h1 style="font-size:22px;font-weight:600;margin:0 0 4px;">
            ${profile.company_name ?? "Twoja firma"}
          </h1>
          <p style="color:#6b7280;font-size:14px;margin:0 0 32px;">
            ${weekStart} – ${weekEnd}
          </p>

          ${issuesHtml}
          ${servicesHtml}

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/panel"
            style="display:inline-block;background:#2563eb;color:white;font-size:14px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">
            Przejdź do panelu →
          </a>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
          <p style="font-size:12px;color:#9ca3af;margin:0;">
            Asseto · Możesz wyłączyć raporty w ustawieniach konta.
          </p>
        </div>
      `,
    });

    sent++;
  }

  return NextResponse.json({ sent });
}
