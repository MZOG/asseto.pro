import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { issueId } = await request.json();

  if (!issueId) {
    return NextResponse.json({ error: "Missing issueId" }, { status: 400 });
  }

  const supabase = await createClient();

  // Pobierz issue z danymi maszyny i właściciela
  const { data: issue } = await supabase
    .from("issues")
    .select(
      `
      id, description, created_at,
      assets!inner(
        name, serial_number, location,
        owner_id,
        profiles!inner(email, company_name)
      )
    `,
    )
    .eq("id", issueId)
    .single();

  if (!issue) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  const asset = issue.assets as any;
  const profile = asset.profiles;
  const ownerEmail = profile?.email;
  const companyName = profile?.company_name ?? "Twoja firma";

  if (!ownerEmail) {
    return NextResponse.json({ error: "No owner email" }, { status: 400 });
  }

  const reportedAt = new Date(issue.created_at).toLocaleString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const { error } = await resend.emails.send({
    from: "Asseto <powiadomienia@asseto.pro>",
    to: ownerEmail,
    subject: `🔴 Nowa awaria — ${asset.name}`,
    html: `
      <div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #111;">
        <div style="margin-bottom: 24px;">
          <span style="background: #eff6ff; color: #2563eb; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 99px; letter-spacing: 0.05em; text-transform: uppercase;">
            Nowa awaria
          </span>
        </div>

        <h1 style="font-size: 22px; font-weight: 600; margin: 0 0 8px;">
          ${asset.name}
        </h1>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px;">${companyName} · ${reportedAt}</p>

        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.05em;">Opis usterki</p>
          <p style="font-size: 15px; color: #111; margin: 0; line-height: 1.6;">
            ${issue.description ?? '<em style="color: #9ca3af;">Brak opisu</em>'}
          </p>
        </div>

        ${
          asset.location
            ? `
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 6px;">
          📍 <strong>Lokalizacja:</strong> ${asset.location}
        </p>`
            : ""
        }

        ${
          asset.serial_number
            ? `
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px;">
          # <strong>Numer seryjny:</strong> ${asset.serial_number}
        </p>`
            : ""
        }

        <a href="${process.env.NEXT_PUBLIC_APP_URL}/panel/awarie/${issue.id}"
          style="display: inline-block; background: #2563eb; color: white; font-size: 14px; font-weight: 600; padding: 10px 20px; border-radius: 8px; text-decoration: none; margin-top: 8px;">
          Zobacz zgłoszenie →
        </a>

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
