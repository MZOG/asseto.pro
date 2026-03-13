import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { name, company, email, phone, message } = await request.json();

  const { error } = await resend.emails.send({
    from: "Asseto Kontakt <no-reply@asseto.pro>",
    to: "marcin@asseto.pro",
    replyTo: email,
    subject: `Nowa wiadomość od ${name}`,
    html: `
      <p><strong>Imię i nazwisko:</strong> ${name}</p>
      <p><strong>Firma:</strong> ${company || "—"}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone || "—"}</p>
      <hr />
      <p><strong>Wiadomość:</strong></p>
      <p>${message.replace(/\n/g, "<br />")}</p>
    `,
  });

  if (error) {
    return NextResponse.json(
      { error: "Nie udało się wysłać wiadomości." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
