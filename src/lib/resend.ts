import { Resend } from "resend";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || !process.env.RESEND_FROM_EMAIL) {
    return null;
  }

  return new Resend(apiKey);
}

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export async function sendEmailSafely({ to, subject, html }: SendEmailInput) {
  try {
    const resend = getResendClient();

    if (!resend) {
      console.log("Resend email skipped: RESEND_API_KEY or RESEND_FROM_EMAIL is not set.");
      return {
        ok: false,
        skipped: true,
        error: "RESEND_API_KEY or RESEND_FROM_EMAIL is not set.",
      };
    }

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL as string,
      to,
      subject,
      html,
    });

    return { ok: true, data: result };
  } catch (error) {
    console.error("Resend email failed", error);
    return {
      ok: false,
      skipped: false,
      error: error instanceof Error ? error.message : "Unable to send email.",
    };
  }
}

export function getAdminNotifyEmail() {
  return (
    process.env.ADMIN_NOTIFY_EMAIL ||
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    "admin@example.com"
  );
}

export async function sendAdminEmail({
  subject,
  html,
}: {
  subject: string;
  html: string;
}) {
  return sendEmailSafely({
    to: getAdminNotifyEmail(),
    subject,
    html,
  });
}

export async function sendCustomerEmail(input: SendEmailInput) {
  return sendEmailSafely(input);
}
