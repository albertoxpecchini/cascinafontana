import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const MAX_NOME = 60;
const MAX_EMAIL = 60;
const MAX_MESSAGGIO = 20000;

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const nome = String(body.nome ?? "").trim().slice(0, MAX_NOME);
    const email = String(body.email ?? "").trim().slice(0, MAX_EMAIL);
    const messaggio = String(body.messaggio ?? "").trim().slice(0, MAX_MESSAGGIO);

    if (!nome || !email || !messaggio) {
      return NextResponse.json(
        { ok: false, error: "Tutti i campi sono obbligatori." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Indirizzo email non valido." },
        { status: 400 },
      );
    }

const { error } = await resend.emails.send({
      from: "Cascina Fontana <onboarding@resend.dev>",
      replyTo: email,
      to: process.env.CONTACT_TO!,
      subject: `Nuovo messaggio dal sito — ${nome}`,
      text: [
        `Nome: ${nome}`,
        `Email: ${email}`,
        ``,
        `Messaggio:`,
        messaggio,
      ].join("\n"),
    });
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { ok: false, error: "Errore nell'invio. Riprova più tardi." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Errore invio email contatti:", err);
    return NextResponse.json(
      { ok: false, error: "Errore interno. Riprova più tardi." },
      { status: 500 },
    );
  }
}
