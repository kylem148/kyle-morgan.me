"use server";

import { Resend } from "resend";
import { PROFILE } from "./profile";

export type ExchangeState = { status: "idle" } | { status: "sent" } | { status: "error"; message: string };

const MAX_LENGTH = { name: 100, email: 254, phone: 40, note: 2000 } as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function exchangeContact(
  _previous: ExchangeState,
  formData: FormData,
): Promise<ExchangeState> {
  const field = (key: keyof typeof MAX_LENGTH) =>
    String(formData.get(key) ?? "")
      .trim()
      .slice(0, MAX_LENGTH[key]);
  const name = field("name");
  const email = field("email");
  const phone = field("phone");
  const note = field("note");

  // People never see the honeypot field, so anything in it came from a bot. Report success so it moves on.
  if (formData.get("botcheck")) return { status: "sent" };

  if (!name && !email && !phone && !note) {
    return {
      status: "error",
      message: `Fill in at least one field so ${PROFILE.firstName} knows who it's from.`,
    };
  }
  if (email && !EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "That email address doesn't look right." };
  }

  const fallback = `Couldn't send right now. You can email ${PROFILE.email} directly.`;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[connect] RESEND_API_KEY must be set to send exchange emails");
    return { status: "error", message: fallback };
  }

  const details = (
    [
      ["Name", name],
      ["Email", email],
      ["Phone", phone],
      ["Note", note],
    ] as [string, string][]
  ).filter(([, value]) => value);
  const who = (name || email || phone || "Someone").replace(/\s+/g, " ");

  try {
    // The only email this form sends: from Kyle's address to Kyle's address. Replying goes to the visitor.
    const { error } = await new Resend(apiKey).emails.send({
      from: process.env.CONNECT_FROM_EMAIL || `kyle-morgan.me <${PROFILE.email}>`,
      to: process.env.CONNECT_NOTIFY_EMAIL || PROFILE.email,
      replyTo: email || undefined,
      subject: `New connection: ${who}`,
      text: [
        `Someone filled out the Exchange Contact form on ${PROFILE.url}.`,
        "",
        ...details.map(([label, value]) => `${label}: ${value}`),
      ].join("\n"),
      html: `<p>Someone filled out the Exchange Contact form on ${PROFILE.url}.</p><table>${details
        .map(
          ([label, value]) =>
            `<tr><td style="padding:4px 16px 4px 0;color:#6a7c8b;vertical-align:top">${label}</td><td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
        )
        .join("")}</table>`,
    });
    if (error) {
      console.error("[connect] exchange email failed", error);
      return { status: "error", message: fallback };
    }
    return { status: "sent" };
  } catch (error) {
    console.error("[connect] sending exchange email threw", error);
    return { status: "error", message: fallback };
  }
}
