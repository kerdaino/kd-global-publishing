import { sendAdminEmail } from "@/lib/resend";
import { jsonError, jsonOk } from "@/lib/utils";

type ContactPayload = {
  name?: string;
  email?: string;
  whatsapp?: string;
  projectType?: string;
  message?: string;
  website?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactPayload;
    const name = text(payload.name);
    const email = text(payload.email).toLowerCase();
    const message = text(payload.message);

    if (text(payload.website)) {
      return jsonOk({ receivedAt: new Date().toISOString(), spam: true });
    }

    if (!name || !email || !message) {
      return jsonError("Name, email, and message are required.");
    }

    if (!isValidEmail(email)) {
      return jsonError("Please enter a valid email address.");
    }

    const result = await sendAdminEmail({
      subject: "New general contact inquiry",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
          <h2>New general contact inquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>WhatsApp:</strong> ${escapeHtml(text(payload.whatsapp) || "Not provided")}</p>
          <p><strong>Project type:</strong> ${escapeHtml(text(payload.projectType) || "Not selected")}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
        </div>
      `,
    });

    if (!result.ok) {
      return jsonError(
        result.skipped
          ? "Email notifications are not configured yet."
          : "Unable to send this inquiry right now.",
        500,
      );
    }

    return jsonOk({ receivedAt: new Date().toISOString() });
  } catch {
    return jsonError("Unable to submit this inquiry right now.", 500);
  }
}

function text(input: unknown) {
  return typeof input === "string" ? input.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
